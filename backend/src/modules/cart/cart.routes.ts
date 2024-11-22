import express from "express";
import {
  addToCart,
  deleteCartItem,
  getCart,
  updateCartItem,
} from "./cart.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const router = express.Router();

// Get the user's cart
router.get("/", authenticate, getCart);

// Add a product to the cart
router.post("/", authenticate, addToCart);

// Update the quantity of a product in the cart
router.patch("/:cartId", authenticate, updateCartItem);

// Delete a specific product from the cart
router.delete("/:cartId", authenticate, deleteCartItem);

export default router;
