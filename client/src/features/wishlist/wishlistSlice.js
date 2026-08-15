import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
  name: "wishlist",

  initialState: {
    items: [],
  },

  reducers: {
    setWishlist: (state, action) => {
      state.items = action.payload;
    },

    addWishlistItem: (state, action) => {
      state.items.push(action.payload);
    },

    removeWishlistItem: (state, action) => {
      state.items = state.items.filter(
        (item) => item.product._id !== action.payload
      );
    },

    clearWishlist: (state) => {
      state.items = [];
    },
  },
});

export const {
  setWishlist,
  addWishlistItem,
  removeWishlistItem,
  clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;