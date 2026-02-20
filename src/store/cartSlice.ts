import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../lib/supabase';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  material_type: string;
  stock_count: number;
  image_url: string | null;
  is_vegan: boolean;
}

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product: Product;
}

interface CartState {
  cartProducts: CartItem[];
  isCartSyncing: boolean;
  cartError: string | null;
}

const initialState: CartState = {
  cartProducts: [],
  isCartSyncing: false,
  cartError: null,
};

/**
 * Sync the local state with the user's remote shopping bag
 */
export const fetchCart = createAsyncThunk('cart/syncWithRemote', async (userId: string) => {
  const { data, error } = await supabase
    .from('cart_items')
    .select(`
      id,
      product_id,
      quantity,
      product:products(*)
    `)
    .eq('user_id', userId);

  if (error) throw error;
  return data as unknown as CartItem[];
});

/**
 * Add a new discovery to the shopping bag or increment existing quantity
 */
export const addToCart = createAsyncThunk(
  'cart/addItem',
  async ({ userId, productId, quantity = 1 }: { userId: string; productId: string; quantity?: number }) => {
    // First, check if this item is already in their curated list
    const { data: existing } = await supabase
      .from('cart_items')
      .select('id, quantity')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .maybeSingle();

    if (existing) {
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity: existing.quantity + quantity, updated_at: new Date().toISOString() })
        .eq('id', existing.id)
        .select(`
          id,
          product_id,
          quantity,
          product:products(*)
        `)
        .single();

      if (error) throw error;
      return data as unknown as CartItem;
    } else {
      const { data, error } = await supabase
        .from('cart_items')
        .insert({ user_id: userId, product_id: productId, quantity })
        .select(`
          id,
          product_id,
          quantity,
          product:products(*)
        `)
        .single();

      if (error) throw error;
      return data as unknown as CartItem;
    }
  }
);

/**
 * Adjust the quantity of a specific item in the bag
 */
export const updateCartQuantity = createAsyncThunk(
  'cart/updateQty',
  async ({ cartItemId, quantity }: { cartItemId: string; quantity: number }) => {
    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity, updated_at: new Date().toISOString() })
      .eq('id', cartItemId)
      .select(`
        id,
        product_id,
        quantity,
        product:products(*)
      `)
      .single();

    if (error) throw error;
    return data as unknown as CartItem;
  }
);

/**
 * Remove an item from the bag entirely
 */
export const removeFromCart = createAsyncThunk('cart/removeItem', async (cartItemId: string) => {
  const { error } = await supabase.from('cart_items').delete().eq('id', cartItemId);

  if (error) throw error;
  return cartItemId;
});

/**
 * Purge the entire shopping bag - usually after a successful checkout
 */
export const clearCart = createAsyncThunk('cart/purgeBag', async (userId: string) => {
  const { error } = await supabase.from('cart_items').delete().eq('user_id', userId);

  if (error) throw error;
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Local purge for manual logouts
    resetCartLocally: (state) => {
      state.cartProducts = [];
      state.cartError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.isCartSyncing = true;
      })
      .addCase(fetchCart.fulfilled, (state, { payload }) => {
        state.isCartSyncing = false;
        state.cartProducts = payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isCartSyncing = false;
        state.cartError = action.error.message || 'We couldn\'t retrieve your bag contents.';
      })

      .addCase(addToCart.fulfilled, (state, { payload }) => {
        const existingIndex = state.cartProducts.findIndex((item) => item.id === payload.id);
        if (existingIndex !== -1) {
          state.cartProducts[existingIndex] = payload;
        } else {
          state.cartProducts.push(payload);
        }
      })

      .addCase(updateCartQuantity.fulfilled, (state, { payload }) => {
        const index = state.cartProducts.findIndex((item) => item.id === payload.id);
        if (index !== -1) {
          state.cartProducts[index] = payload;
        }
      })

      .addCase(removeFromCart.fulfilled, (state, { payload }) => {
        state.cartProducts = state.cartProducts.filter((item) => item.id !== payload);
      })

      .addCase(clearCart.fulfilled, (state) => {
        state.cartProducts = [];
      });
  },
});

export const { resetCartLocally } = cartSlice.actions;
export default cartSlice.reducer;
