import express from "express";
import auth from "../middleware/auth.js";
import authorize from "../middleware/authorize.js";
import checkProductOwner from "../middleware/checkProductOwner.js";
import upload from "../middleware/upload.js";
import { createProductValidation } from "../validators/product.validator.js";
import validate from "../middleware/validate.js";

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct, uploadProductImages,
  getMyProducts,
} from "../controllers/product.controller.js";

const router = express.Router();

// Public routes
router.get("/", getProducts);

router.get(
  "/my-products",
  auth,
  authorize("user", "admin"),
  getMyProducts
);

router.get("/:id", getProductById);

// Protected routes
router.post(
  "/",
  auth,
  authorize("user", "admin"),
  createProductValidation,
  validate,
  createProduct
);

router.put(
  "/:id",
  auth,
  authorize("user", "admin"),
  checkProductOwner,
  updateProduct
);

router.delete(
  "/:id",
  auth,
  authorize("user", "admin"),
  checkProductOwner,
  deleteProduct
);

router.post(
  "/:id/images",
  auth,
  authorize("user", "admin"),
  checkProductOwner,
  upload.array("images", 5),
  uploadProductImages
);


export default router;