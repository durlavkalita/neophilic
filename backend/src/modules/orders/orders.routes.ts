import express from "express";
import {
  cancelOrder,
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByUserId,
  getOrderInvoice,
  orderStatusChange,
} from "./order.controller.js";
import {
  authenticate,
  authorizeAdmin,
} from "../../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", authenticate, authorizeAdmin, getAllOrders);
router.post("/", authenticate, createOrder);
router.get("/:id", authenticate, getOrderById);
router.get("/user/:userId", authenticate, getOrdersByUserId);
router.get("/:id/invoice", authenticate, getOrderInvoice);
router.patch("/:id/cancel", authenticate, cancelOrder);
router.patch(
  "/:id/status/change",
  authenticate,
  authorizeAdmin,
  orderStatusChange
);

export default router;
