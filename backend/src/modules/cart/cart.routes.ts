import express from "express";
import {
  addToCart,
  deleteCartItem,
  getCart,
  updateCartItem,
} from "./cart.controller.js";

const router = express.Router();

// Get the user's cart
router.get("/:userId", getCart);

// Add a product to the cart
router.post("/:userId", addToCart);

// Update the quantity of a product in the cart
router.patch("/:userId/:cartId", updateCartItem);

// Delete a specific product from the cart
router.delete("/:userId/:cartId", deleteCartItem);

export default router;
