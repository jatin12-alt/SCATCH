import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../lib/supabase';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Tote' | 'Backpack' | 'Clutches';
  material_type: string;
  stock_count: number;
  image_url: string | null;
  is_vegan: boolean;
  created_at: string;
  updated_at: string;
}

interface ProductsState {
  productList: Product[];
  isProductsFetching: boolean;
  productsError: string | null;
  selectedCategory: string | null;
  selectedMaterial: string | null;
}

const initialState: ProductsState = {
  productList: [],
  isProductsFetching: false,
  productsError: null,
  selectedCategory: null,
  selectedMaterial: null,
};

/**
 * Retrieve the latest collections from our archive
 */
export const fetchProducts = createAsyncThunk('products/retrieveFromArchive', async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Product[];
});

/**
 * Manually register a new handcrafted piece to the registry
 */
export const addProduct = createAsyncThunk(
  'products/registerNewPiece',
  async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single();

      if (error) throw error;
      return data as Product;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Registry entry failed.';
      return rejectWithValue(message);
    }
  }
);

/**
 * Update the details of an existing archive entry
 */
export const updateProduct = createAsyncThunk(
  'products/modifyRegistryEntry',
  async ({ id, updates }: { id: string; updates: Partial<Product> }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Product;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Modification process failed.';
      return rejectWithValue(message);
    }
  }
);

/**
 * Remove a piece from the public registry
 */
export const deleteProduct = createAsyncThunk(
  'products/removeFromRegistry',
  async (id: string, { rejectWithValue }) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Removal process failed.';
      return rejectWithValue(message);
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
    },
    setSelectedMaterial: (state, action: PayloadAction<string | null>) => {
      state.selectedMaterial = action.payload;
    },
    resetRegistryFilters: (state) => {
      state.selectedCategory = null;
      state.selectedMaterial = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isProductsFetching = true;
      })
      .addCase(fetchProducts.fulfilled, (state, { payload }) => {
        state.isProductsFetching = false;
        state.productList = payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isProductsFetching = false;
        state.productsError = action.error.message || 'We couldn\'t load our collection at this moment.';
      })

      .addCase(addProduct.fulfilled, (state, { payload }) => {
        state.productList.unshift(payload);
      })

      .addCase(updateProduct.fulfilled, (state, { payload }) => {
        const index = state.productList.findIndex((item) => item.id === payload.id);
        if (index !== -1) {
          state.productList[index] = payload;
        }
      })

      .addCase(deleteProduct.fulfilled, (state, { payload }) => {
        state.productList = state.productList.filter((item) => item.id !== payload);
      });
  },
});

export const { setSelectedCategory, setSelectedMaterial, resetRegistryFilters } = productsSlice.actions;
export default productsSlice.reducer;
