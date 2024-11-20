import express from "express";
import {
  authenticate,
  authorizeAdmin,
} from "../../middleware/auth.middleware.js";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategoryById,
} from "./categories.controller.js";
import { validateCategory } from "./categories.validators.js";

const router = express.Router();

router.get("/", getAllCategories);
router.post(
  "/",
  authenticate,
  authorizeAdmin,
  validateCategory,
  createCategory
);
router.get("/:id", getCategoryById);
router.put(
  "/:id",
  authenticate,
  authorizeAdmin,
  validateCategory,
  updateCategoryById
);

export default router;
