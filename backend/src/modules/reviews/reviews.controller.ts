import { Request, Response } from "express";
import { Review } from "./reviews.model.js";
import logger from "../../config/logger.config.js";
import { Product } from "../products/products.model.js";
import { User } from "../auth/auth.model.js";
import { Order } from "../orders/orders.model.js";

export const getReviewByProduct = async (req: Request, res: Response) => {
  const productId = req.params.productId;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({
        message: "Product not found.",
        error: "Product not found.",
      });
      return;
    }
    const reviews = await Review.find({ productId: productId });
    if (!reviews || reviews.length == 0) {
      res.status(404).json({
        message: "No review found for this product",
        error: "No review found for this product",
      });
      return;
    }
    res.status(200).json({ message: "Successful", data: reviews });
  } catch (error) {
    logger.error(error);
    res
      .status(500)
      .json({ message: "Unsuccessful", error: (error as Error).message });
    return;
  }
};

export const getReviewByUser = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        message: "User not found.",
        error: "User not found.",
      });
      return;
    }
    const reviews = await Review.find({ userId: userId });
    if (!reviews || reviews.length == 0) {
      res.status(404).json({
        message: "No review found by this user",
        error: "No review found by this user",
      });
      return;
    }
    res.status(200).json({ message: "Successful", data: reviews });
  } catch (error) {
    logger.error(error);
    res
      .status(500)
      .json({ message: "Unsuccessful", error: (error as Error).message });
    return;
  }
};

export const createReview = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { productId, orderId, rating } = req.body;
  try {
    const review = await Review.find({
      productId: productId,
      userId: userId,
      orderId: orderId,
    });
    if (review) {
      res.status(400).json({
        message: "Review for product already provided by user.",
        error: "Review for product already provided by user.",
      });
      return;
    }
    const product = await Product.findById(productId);
    if (!product) {
      res.status(400).json({
        message: "Product not found",
        error: "Product not found",
      });
      return;
    }
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        message: "User not found.",
        error: "User not found.",
      });
      return;
    }
    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404).json({
        message: "Order not found.",
        error: "Order not found.",
      });
      return;
    }
    // else if (order.userId != userId) {
    //   res.status(403).json({
    //     message: "Not authorized",
    //     error: "Not authorized",
    //   });
    //   return;
    // }
    const newReview = new Review({
      userId,
      productId,
      orderId,
      rating,
      comment: req.body.comment ? req.body.comment : "",
    });
    await newReview.save();

    product.ratingTotal += rating;
    product.ratingCount += 1;
    await product.save();

    res.status(200).json({ message: "Successful", data: newReview });
    return;
  } catch (error) {
    logger.error(error);
    res
      .status(500)
      .json({ message: "Unsuccessful", error: (error as Error).message });
    return;
  }
};
