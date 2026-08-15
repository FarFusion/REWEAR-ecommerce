import express from "express";

import auth from "../middleware/auth.js";
import authorize from "../middleware/authorize.js";

import {
    sellerDashboard, getDashboardStats
} from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get(
    "/seller",
    auth,
    authorize("seller", "admin"),
    sellerDashboard
);

router.get(
  "/",
  auth,
  authorize("admin"),
  getDashboardStats
);


export default router;