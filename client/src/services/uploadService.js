import api from "./api";

export const uploadImage = (formData) =>
  api.post("/products/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });