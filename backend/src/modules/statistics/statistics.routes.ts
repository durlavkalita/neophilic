import express from "express";
import {
  authenticate,
  authorizeAdmin,
} from "../../middleware/auth.middleware.js";
import { getDashboardStatistics } from "./statistics.controller.js";

const router = express.Router();

router.get("/", authenticate, authorizeAdmin, getDashboardStatistics);

export default router;
