import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../lib/supabase';

// Types representing our distinct entities
interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  material_type: string;
  stock_count: number;
  image_url: string | null;
}

interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_at_purchase: number;
  created_at: string;
  product: Product;
}

interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shipping_name: string;
  shipping_address: string;
  shipping_city: string;
  shipping_postal_code: string;
  shipping_phone: string;
  payment_method: string;
  created_at: string;
  order_items: OrderItem[];
}

interface OrdersState {
  orderList: Order[];
  isFetchingOrders: boolean;
  ordersError: string | null;
}

const initialState: OrdersState = {
  orderList: [],
  isFetchingOrders: false,
  ordersError: null,
};

/**
 * Fetch all available orders - typically used by staff/admin roles
 */
export const fetchOrders = createAsyncThunk('orders/fetchAll', async () => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        product:products(*)
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as unknown as Order[];
});

/**
 * Fetch orders specific to a logged-in account
 */
export const fetchUserOrders = createAsyncThunk('orders/fetchForUser', async (userId: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        product:products(*)
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as unknown as Order[];
});

/**
 * Transactional process to create an order and its associated line items
 */
export const createOrder = createAsyncThunk(
  'orders/createNew',
  async (
    {
      userId,
      cartItems,
      shippingInfo,
    }: {
      userId: string;
      cartItems: { product_id: string; quantity: number; price: number }[];
      shippingInfo: {
        name: string;
        address: string;
        city: string;
        postalCode: string;
        phone: string;
      };
    },
    { rejectWithValue }
  ) => {
    try {
      const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

      // 1. Create the base order record
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: userId,
          total_amount: totalAmount,
          shipping_name: shippingInfo.name,
          shipping_address: shippingInfo.address,
          shipping_city: shippingInfo.city,
          shipping_postal_code: shippingInfo.postalCode,
          shipping_phone: shippingInfo.phone,
          payment_method: 'cod',
          status: 'pending',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Map cart items to the new order ID
      const orderItems = cartItems.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price_at_purchase: item.price,
      }));

      // 3. Batch insert line items
      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      // 4. Fetch the hydrated order to keep the UI state in sync
      const { data: fullOrder, error: fetchError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            product:products(*)
          )
        `)
        .eq('id', order.id)
        .single();

      if (fetchError) throw fetchError;
      return fullOrder as unknown as Order;
    } catch (error: any) {
      return rejectWithValue(error.message || 'We hit a snag processing your purchase.');
    }
  }
);

/**
 * Update the logistic status of a specific order
 */
export const updateOrderStatus = createAsyncThunk(
  'orders/updateStatus',
  async ({ orderId, status }: { orderId: string; status: Order['status'] }) => {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select(`
        *,
        order_items (
          *,
          product:products(*)
        )
      `)
      .single();

    if (error) throw error;
    return data as unknown as Order;
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    // We could add a clearOrders action here if needed for logouts
    resetOrdersState: (state) => {
      state.orderList = [];
      state.ordersError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Bulk Fetch Cases
      .addCase(fetchOrders.pending, (state) => {
        state.isFetchingOrders = true;
      })
      .addCase(fetchOrders.fulfilled, (state, { payload }) => {
        state.isFetchingOrders = false;
        state.orderList = payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isFetchingOrders = false;
        state.ordersError = action.error.message || 'System failed to retrieve order historical data.';
      })

      // User-specific Fetch Cases
      .addCase(fetchUserOrders.pending, (state) => {
        state.isFetchingOrders = true;
      })
      .addCase(fetchUserOrders.fulfilled, (state, { payload }) => {
        state.isFetchingOrders = false;
        state.orderList = payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isFetchingOrders = false;
        state.ordersError = action.error.message || 'Couldn\'t load your purchase history.';
      })

      // Creation & Updates
      .addCase(createOrder.fulfilled, (state, { payload }) => {
        state.orderList.unshift(payload);
      })
      .addCase(updateOrderStatus.fulfilled, (state, { payload }) => {
        const index = state.orderList.findIndex((item) => item.id === payload.id);
        if (index !== -1) {
          state.orderList[index] = payload;
        }
      });
  },
});

export const { resetOrdersState } = ordersSlice.actions;
export default ordersSlice.reducer;
