import api from "./api";

export const getAllUsers = () => {
  return api.get("/users");
};

export const getUserById = (id) => {
  return api.get(`/users/${id}`);
};

export const updateUserRole = (id, role) => {
  return api.patch(`/users/${id}/role`, {
    role,
  });
};

export const deleteUser = (id) => {
  return api.delete(`/users/${id}`);
};