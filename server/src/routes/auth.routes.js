import express from "express";

import {
  register,
  login,
  verifyOTP,
  resendOTP,
  getProfile,
  updateProfile,
  forgotPassword,
  resetPassword,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  uploadAvatar,
} from "../controllers/auth.controller.js";
import upload from "../middleware/upload.js";
import authorize from "../middleware/authorize.js";
import auth from "../middleware/auth.js";


const router = express.Router();


// Public routes

router.post("/register", register);

router.post("/login", login);

router.post("/verify-otp", verifyOTP);

router.post("/resend-otp", resendOTP);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);


// Protected routes


router.get(
  "/me",
  auth,
  getProfile
);

router.put(
  "/profile",
  auth,
  updateProfile
);

// ==========================================
// ADDRESS ROUTES
// ==========================================

router.get(
  "/addresses",
  auth,
  getAddresses
);

router.post(
  "/addresses",
  auth,
  addAddress
);

router.put(
  "/addresses/:addressId",
  auth,
  updateAddress
);

router.delete(
  "/addresses/:addressId",
  auth,
  deleteAddress
);

router.patch(
  "/addresses/:addressId/default",
  auth,
  setDefaultAddress
);

router.post(
  "/avatar",
  auth,
  authorize("user", "admin"),
  upload.single("avatar"),
  uploadAvatar
);

export default router;