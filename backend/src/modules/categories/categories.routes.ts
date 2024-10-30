import express from "express";
import {
  authenticate,
  authorizeAdmin,
} from "../../middleware/auth.middleware.js";
import {
  createCategory,
  deleteCategoryById,
  getAllCategories,
  getCategoryById,
  updateCategoryById,
} from "./categories.controller.js";

const router = express.Router();

router.get("/", authenticate, getAllCategories);
router.get("/:id", authenticate, getCategoryById);
router.post("/", authenticate, authorizeAdmin, createCategory);
router.put("/:id", authenticate, authorizeAdmin, updateCategoryById);
router.delete("/:id", authenticate, authorizeAdmin, deleteCategoryById);

export default router;
