import api from "./api";

export const getCart = () => {
  return api.get("/cart");
};

export const addToCart = (data) => {
  return api.post("/cart", data);
};

export const updateCartItem = (itemId, quantity) => {
  return api.patch(`/cart/${itemId}`, {
    quantity,
  });
};

export const removeCartItem = (itemId) => {
  return api.delete(`/cart/${itemId}`);
};

export const clearCart = () => {
  return api.delete("/cart");
};