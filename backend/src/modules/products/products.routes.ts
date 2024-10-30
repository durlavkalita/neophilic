import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProductById,
  deleteProductById,
  getProductsByCategory,
  getProductsByCollection,
  updateProductStatus,
  searchProducts,
} from "./products.controller.js";
import {
  authenticate,
  authorizeAdmin,
} from "../../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.get("/search/name", searchProducts);
router.post("/", authenticate, authorizeAdmin, createProduct);
router.put("/:id", authenticate, authorizeAdmin, updateProductById);
router.delete("/:id", authenticate, authorizeAdmin, deleteProductById);

// Additional Routes
router.get("/category/:categoryId", getProductsByCategory);
router.get("/collection/:collectionId", getProductsByCollection);
router.patch("/:id/status", updateProductStatus);

export default router;
