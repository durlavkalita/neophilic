import { Request, Response } from "express";
import { Cart } from "./cart.model.js";
import logger from "../../config/logger.config.js";

export const getCart = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  try {
    const cart = await Cart.find({ userId: userId }).populate("productId");
    if (!cart) {
      res
        .status(404)
        .json({ message: "Cart not found", error: "Cart not found" });
      return;
    }
    res.status(200).json({ message: "Successful", data: cart });
    return;
  } catch (error) {
    logger.error(error);
    res
      .status(500)
      .json({ message: "Unsuccessful", error: (error as Error).message });
    return;
  }
};

export const addToCart = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { productId, quantity } = req.body;

  try {
    const cart = await Cart.findOne({
      userId: userId,
      productId: productId,
    });

    if (!cart) {
      const newCart = new Cart({
        userId,
        productId,
        quantity,
      });

      await newCart.save();
      res.status(201).json({ message: "Successful", data: newCart });
      return;
    } else {
      cart.quantity += quantity;
      await cart.save();
    }
    res.status(201).json({ message: "Successful", data: cart });
    return;
  } catch (error) {
    logger.error(error);
    res
      .status(500)
      .json({ message: "Unsuccessful", error: (error as Error).message });
    return;
  }
};

export const updateCartItem = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { cartId } = req.params;
  const { quantity } = req.body;

  try {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      res
        .status(404)
        .json({ message: "Cart not found", error: "Cart not found" });
      return;
    }
    if (cart.userId.toString() != userId) {
      res.status(403).json({
        message: "Invalid credentials",
        error: "Cart owner is not same as authorized user",
      });
      return;
    }
    cart.quantity = quantity;
    await cart.save();
    res.status(200).json({ message: "Successful", data: cart });
  } catch (error) {
    logger.error(error);
    res
      .status(500)
      .json({ message: "Unsuccessful", error: (error as Error).message });
  }
};

export const deleteCartItem = async (req: Request, res: Response) => {
  const { cartId } = req.params;
  const userId = req.user?.id;
  try {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      res
        .status(404)
        .json({ message: "Cart not found", error: "Cart not found" });
      return;
    }
    if (cart.userId.toString() !== userId) {
      res.status(403).json({
        message: "Invalid credentials",
        error: "Cart owner is not same as authorized user",
      });
      return;
    }
    await Cart.findByIdAndDelete(cartId);
    res.status(200).json({ message: "Successful" });
    return;
  } catch (error) {
    logger.error(error);
    res
      .status(500)
      .json({ message: "Unsuccessful", error: (error as Error).message });
    return;
  }
};
