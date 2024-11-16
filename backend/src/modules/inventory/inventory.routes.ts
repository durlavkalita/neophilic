import express from "express";
import { getInventoryHistory } from "./inventory.controller.js";
import {
  authenticate,
  authorizeAdmin,
} from "../../middleware/auth.middleware.js";
const router = express.Router();

router.get("/:productId", authenticate, authorizeAdmin, getInventoryHistory);

export default router;
