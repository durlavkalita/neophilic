import express from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import {
  createReview,
  getReviewByProduct,
  getReviewByUser,
} from "./reviews.controller.js";

const router = express.Router();

router.get("/product/:productId", authenticate, getReviewByProduct);

router.get("/user/:userId", authenticate, getReviewByUser);

router.post("/", authenticate, createReview);

export default router;
