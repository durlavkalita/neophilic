import express from "express";
import { validateLogin, validateRegister } from "./auth.validators.js";
import {
  getUserById,
  loginUser,
  registerUser,
  updateUserById,
  updateUserRoleById,
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
router.get("/user/:id", authenticate, getUserById);
router.put(
  "/user/:id",
  authenticate,
  authorizeUser,
  uploadUserImage.single("files"),
  updateUserById
);
router.patch(
  "/user/:id/role",
  authenticate,
  authorizeAdmin,
  updateUserRoleById
);

export default router;
