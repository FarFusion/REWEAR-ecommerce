import api from "./api";

export const getAllOrders = () => {
  return api.get("/orders/admin");
};

export const updateOrderStatus = (id, data) =>
  api.patch(
    `/orders/admin/${id}/status`,
    data
  );