import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",

  initialState: {
    items: [],
  },

  reducers: {
    setCart: (state, action) => {
      state.items = action.payload.items || [];
    },

    addCartItem: (state, action) => {
      state.items.push(action.payload);
    },

    removeCartItem: (state, action) => {
      state.items = state.items.filter(
        (item) =>
          item.product._id !== action.payload
      );
    },

    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  setCart,
  addCartItem,
  removeCartItem,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;