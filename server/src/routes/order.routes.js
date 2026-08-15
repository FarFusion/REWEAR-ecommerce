import express from "express";
import auth from "../middleware/auth.js";

import {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
} from "../controllers/order.controller.js";

import admin from "../middleware/admin.js";


const router = express.Router();

router.use(auth);

router.post("/", createOrder);

router.get("/", getMyOrders);

router.get("/admin", admin, getAllOrders);

router.patch(
  "/admin/:id/status",
  admin,
  updateOrderStatus
);

router.get("/:id", getOrderById);



export default router;