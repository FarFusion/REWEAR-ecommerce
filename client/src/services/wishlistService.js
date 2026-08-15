import api from "./api";

export const getWishlist = () => {
  return api.get("/wishlist");
};

export const addToWishlist = (productId) => {
  console.log("ADDING WISHLIST:", productId);

  return api.post(`/wishlist/${productId}`);
};

export const removeFromWishlist = (productId) => {
  return api.delete(`/wishlist/${productId}`);
};