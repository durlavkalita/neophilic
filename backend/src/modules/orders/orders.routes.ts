import express from "express";
import {
  cancelOrder,
  createOrder,
  getAllOrders,
  getOrderById,
  getOrderByUserId,
  getOrderInvoice,
} from "./order.controller.js";
import {
  authenticate,
  authorizeAdmin,
} from "../../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", authenticate, authorizeAdmin, getAllOrders);
router.post("/", authenticate, createOrder);
router.get("/:id", authenticate, getOrderById);
router.get("/user/:userId", authenticate, getOrderByUserId);
router.get("/:id/invoice", authenticate, getOrderInvoice);
router.patch("/:id/cancel", authenticate, cancelOrder);

export default router;
