import api from "./api";

export const getReviews = (productId) => {
  return api.get(`/reviews/${productId}`);
};

export const createReview = (data) => {
  return api.post("/reviews", data);
};

export const deleteReview = (reviewId) => {
  return api.delete(`/reviews/${reviewId}`);
};
