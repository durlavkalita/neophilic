import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProductById,
  getProductsByCategory,
  searchProducts,
} from "./products.controller.js";
import {
  authenticate,
  authorizeAdmin,
} from "../../middleware/auth.middleware.js";
import { upload } from "../s3_storage/index.js";
import { validateProduct } from "./products.validators.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.get("/search/name", searchProducts);
router.post(
  "/",
  authenticate,
  authorizeAdmin,
  upload.array("photos"),
  createProduct
);
router.put(
  "/:id",
  authenticate,
  authorizeAdmin,
  upload.array("photos"),
  updateProductById
);

// Additional Routes
router.get("/category/:categoryId", getProductsByCategory);

export default router;
