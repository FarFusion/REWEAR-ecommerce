import express from "express";

import auth from "../middleware/auth.js";
import authorize from "../middleware/authorize.js";

import {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.use(auth);
router.use(authorize("admin"));

router.get("/", getAllUsers);

router.get("/:id", getUserById);

router.patch("/:id/role", updateUserRole);

router.delete("/:id", deleteUser);

export default router;