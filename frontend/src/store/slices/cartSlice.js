import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  showFlyout: false,
  lastAddedId: null
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const item = action.payload;
      const existing = state.items.find((i) => i._id === item._id);
      if (existing) {
        existing.quantity = Math.min(existing.quantity + (item.quantity || 1), item.countInStock ?? 99);
      } else {
        state.items.push({ ...item, quantity: item.quantity || 1 });
      }
      state.showFlyout = true;
      state.lastAddedId = item._id;
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((i) => i._id !== action.payload);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i._id === id);
      if (item) {
        item.quantity = Math.max(1, Math.min(quantity, item.countInStock ?? 99));
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
    showFlyout: (state, action) => {
      state.showFlyout = action.payload;
    },
    hideFlyout: (state) => {
      state.showFlyout = false;
    },
    setLastAdded: (state, action) => {
      state.lastAddedId = action.payload;
    }
  }
});

export const { addItem, removeItem, updateQuantity, clearCart, showFlyout, hideFlyout, setLastAdded } =
  cartSlice.actions;
export default cartSlice.reducer;