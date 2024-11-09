import express from "express";
import { validateLogin, validateRegister } from "./auth.validators.js";
import {
  getAllUsers,
  getUserById,
  loginUser,
  registerUser,
  updateUserById,
  updateUserRoleById,
  verifyToken,
} from "./auth.controller.js";
import {
  authenticate,
  authorizeAdmin,
  authorizeUser,
} from "../../middleware/auth.middleware.js";
import { uploadUserImage } from "../../utils/helpers.js";

const router = express.Router();

router.post("/register", validateRegister, registerUser);
router.post("/login", validateLogin, loginUser);
router.get("/users/:id", authenticate, getUserById);
router.get("/users", authenticate, authorizeAdmin, getAllUsers);
router.put(
  "/users/:id",
  authenticate,
  authorizeUser,
  uploadUserImage.single("files"),
  updateUserById
);
router.patch(
  "/users/:id/role",
  authenticate,
  authorizeAdmin,
  updateUserRoleById
);
router.get("/verify-token", authenticate, verifyToken);

export default router;
