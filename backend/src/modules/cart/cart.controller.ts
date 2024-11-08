import { Request, Response } from "express";
import { Cart } from "./cart.model.js";

export const getCart = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  try {
    const cart = await Cart.find({ user: userId });
    if (!cart) {
      res.status(404).json({ message: "Cart not found" });
      return;
    }
    res.status(200).json({ message: "Successful", data: cart });
    return;
  } catch (error: any) {
    res.status(500).json({ error: error.message });
    return;
  }
};

export const addToCart = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({
      user: userId,
      product: productId,
    });

    if (!cart) {
      const newCart = new Cart({
        user: userId,
        product: productId,
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
    return;
  }
};

export const updateCartItem = async (req: Request, res: Response) => {
  const { userId, cartId } = req.params;
  const { quantity } = req.body;

  try {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      res.status(404).json({ message: "Cart not found" });
      return;
    }
    cart.quantity = quantity;
    await cart.save();
    res.status(200).json({ message: "Successful", data: cart });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCartItem = async (req: Request, res: Response) => {
  const { userId, cartId } = req.params;

  try {
    const cart = await Cart.findByIdAndDelete(cartId);
    if (!cart) {
      res.status(404).json({ message: "Cart not found" });
      return;
    }
    res.status(200).json({ message: "Product deleted successfully" });
    return;
  } catch (error: any) {
    res.status(500).json({ error: error.message });
    return;
  }
};
