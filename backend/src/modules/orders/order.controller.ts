import { Request, Response } from "express";
import { Order } from "./orders.model.js";
import { InventoryHistory } from "../inventory/inventory.model.js";
import { Product } from "../products/products.model.js";
import mongoose from "mongoose";

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const order = await Order.find();
    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }
    res.status(200).json({ message: "Successful", data: order });
    return;
  } catch (error: any) {
    res.status(500).json({ error: error.message });
    return;
  }
};

export const createOrder = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  const {
    orderItems,
    deliveryAddress,
    contactNumber,
    paymentStatus,
    paymentMethod,
    currentStatus,
  } = req.body;

  try {
    // Calculate total price from order items
    let totalAmount = 0;
    // Process each item to check stock and calculate total amount
    for (const item of orderItems) {
      const { productId, quantity, priceAtTime } = item;
      const product = await Product.findById(productId);

      if (!product) {
        res
          .status(404)
          .json({ error: `Product with ID ${productId} not found.` });
        return;
      }

      if (product.currentStock < quantity) {
        res
          .status(400)
          .json({ error: `Insufficient stock for product ID ${productId}.` });
        return;
      }

      // Update product stock
      product.currentStock -= quantity;
      console.log(product);

      await product.save();

      // Add inventory history entry for sale
      await InventoryHistory.create([
        {
          productId,
          quantityChanged: product.currentStock - quantity, // Stock decreases in sale
          type: "SALE",
          referenceId: null,
          notes: "Product Sale",
        },
      ]);

      // Calculate total price
      totalAmount += quantity * Number(priceAtTime);
    }

    // Create the order
    const order = await Order.create([
      {
        user: userId,
        items: orderItems,
        totalAmount,
        deliveryAddress,
        contactNumber,
        paymentStatus: paymentStatus || "PENDING",
        paymentMethod: paymentMethod || "COD",
        currentStatus: currentStatus || "PENDING",
      },
    ]);

    res.status(201).json({ message: "Successful", data: order });
    return;
  } catch (error: any) {
    res.status(500).json({ error: error.message });
    return;
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id);
    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }
    res.status(200).json({ message: "Successful", data: order });
    return;
  } catch (error: any) {
    res.status(500).json({ error: error.message });
    return;
  }
};

export const getOrderByUserId = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const orders = await Order.find({ user: userId });
    if (!orders.length) {
      res.status(404).json({ message: "No orders found for this user" });
      return;
    }

    res.status(200).json({ message: "Successful", data: orders });
    return;
  } catch (error: any) {
    res.status(500).json({ error: error.message });
    return;
  }
};

// Get Order Invoice
export const getOrderInvoice = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id).populate("orderItems");
    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    // Generate a simple invoice as a response (for demonstration)
    const invoice = {
      orderId: order._id,
      userId: order.user,
      totalAmount: order.totalAmount,
      items: order.items,
      deliveryAddress: order.deliveryAddress,
      contactNumber: order.contactNumber,
      createdAt: order.createdAt,
    };

    res.status(200).json({ message: "Successful", data: invoice });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
    return;
  }
};

// Cancel Order
export const cancelOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  try {
    const order = await Order.findById(id);
    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }
    if (order.currentStatus === "CANCELED") {
      res.status(400).json({ message: "Order is already canceled" });
      return;
    }

    order.currentStatus = "CANCELED";

    const inventoryUpdates = order.items.map(async (item) => {
      const { productId, quantity } = item;

      // Update product's current stock
      const product = await Product.findById(productId);
      if (product) {
        product.currentStock += quantity;
        await product.save();

        // Record the inventory update
        const inventoryEntry = new InventoryHistory({
          productId,
          quantityChanged: quantity,
          type: "RETURN",
          referenceId: order._id,
          notes: "Order cancellation return",
          updatedBy: userId,
        });
        await inventoryEntry.save();
      }
    });

    // Wait for all inventory updates to complete
    await Promise.all(inventoryUpdates);

    await order.save();
    res.json({ message: "Order has been cancelled", order });
    return;
  } catch (error: any) {
    res.status(500).json({ error: error.message });
    return;
  }
};
