import api from "./api";


// Login
export const login = (data) =>
  api.post("/auth/login", data);


// Register
export const registerUser = (data) =>
  api.post("/auth/register", data);


// Verify OTP
export const verifyOTP = (data) =>
  api.post("/auth/verify-otp", data);


// Resend OTP
export const resendOTP = (data) =>
  api.post("/auth/resend-otp", data);


// Get Profile
export const getProfile = () => {
  return api.get("/auth/me");
};


// Update Profile
export const updateProfile = (data) => {
  return api.put("/auth/profile", data);
};

// Forgot Password
export const forgotPassword = (data) =>
  api.post("/auth/forgot-password", data);

// Reset Password
export const resetPassword = (data) =>
  api.post("/auth/reset-password", data);


export const getAddresses = () =>
  api.get("/auth/addresses");

export const addAddress = (data) =>
  api.post("/auth/addresses", data);

export const updateAddress = (addressId, data) =>
  api.put(`/auth/addresses/${addressId}`, data);

export const deleteAddress = (addressId) =>
  api.delete(`/auth/addresses/${addressId}`);

export const setDefaultAddress = (addressId) =>
  api.patch(`/auth/addresses/${addressId}/default`);

export const uploadAvatar = (formData) =>
  api.post("/auth/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });