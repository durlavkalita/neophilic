import { Request, Response } from "express";
import { Order } from "./orders.model.js";
import { InventoryHistory } from "../inventory/inventory.model.js";
import { Product } from "../products/products.model.js";
import logger from "../../config/logger.config.js";

export const getAllOrders = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string);
  const limit = parseInt(req.query.limit as string);
  if (!page && !limit) {
    try {
      const orders = await Order.find().populate({
        path: "userId",
        select: "-password",
      });
      res.status(200).json({ message: "Successful", data: orders });
      return;
    } catch (error: any) {
      logger.error(error);
      res.status(500).json({ message: "Unsuccessful", error: error.message });
      return;
    }
  } else {
    try {
      const skip = (page - 1) * limit;
      const orders = await Order.find()
        .populate({ path: "userId", select: "-password" })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      const total = await Order.countDocuments();
      res.status(200).json({
        message: "Successful",
        data: orders,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        totalItems: total,
      });
      return;
    } catch (error: any) {
      logger.error(error);
      res.status(500).json({ message: "Unsuccessful", error: error.message });
      return;
    }
  }
};

export const createOrder = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  const {
    orderItems,
    deliveryAddress,
    phoneNumber,
    paymentStatus,
    paymentMethod,
    currentStatus,
  } = req.body;

  try {
    // Calculate total price from order items
    let totalAmount = 0;
    // Process each item to check stock and calculate total amount
    let orderItemsMod = [];
    for (const item of orderItems) {
      const { productId, quantity } = item;
      const product = await Product.findById(productId);

      if (!product) {
        res.status(404).json({
          message: "Unsuccessful",
          error: `Product with ID ${productId} not found.`,
        });
        return;
      }

      if (product.stock < quantity) {
        res.status(400).json({
          message: "Unsuccessful",
          error: `Insufficient stock for product ID ${productId}.`,
        });
        return;
      }

      // Update product stock
      product.stock -= quantity;
      await product.save();

      // Add inventory history entry for sale
      await InventoryHistory.create([
        {
          productId,
          quantityChanged: product.stock - quantity, // Stock decreases in sale
          type: "SALE",
          referenceId: null,
          notes: "Product Sale",
        },
      ]);
      const itemsDict = {
        productId: productId,
        quantity: quantity,
        priceAtTime: product.currentPrice,
      };
      orderItemsMod.push(itemsDict);
      // Calculate total price
      totalAmount += quantity * Number(product.currentPrice);
    }

    // Create the order
    const order = await Order.create([
      {
        userId: userId,
        orderItems: orderItemsMod,
        totalAmount,
        deliveryAddress,
        phoneNumber,
        paymentStatus: paymentStatus || "PENDING",
        paymentMethod: paymentMethod || "COD",
        currentStatus: currentStatus || "PENDING",
      },
    ]);

    res.status(201).json({ message: "Successful", data: order });
    return;
  } catch (error: any) {
    logger.error(error);
    res.status(500).json({ message: "Unsuccessful", error: error.message });
    return;
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id)
      .populate({
        path: "userId",
        select: "-password",
      })
      .populate({
        path: "orderItems.productId",
      });
    if (!order) {
      res
        .status(404)
        .json({ message: "Order not found", error: "Order not found" });
      return;
    }
    res.status(200).json({ message: "Successful", data: order });
    return;
  } catch (error: any) {
    logger.error(error);
    res.status(500).json({ message: "Unsuccessful", error: error.message });
    return;
  }
};

export const getOrdersByUserId = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const orders = await Order.find({ userId: userId });
    if (!orders.length) {
      res.status(404).json({
        message: "Unsuccessful",
        error: "No orders found for this user",
      });
      return;
    }

    res.status(200).json({ message: "Successful", data: orders });
    return;
  } catch (error: any) {
    logger.error(error);
    res.status(500).json({ message: "Unsuccessful", error: error.message });
    return;
  }
};

// Get Order Invoice
export const getOrderInvoice = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id).populate("orderItems");
    if (!order) {
      res
        .status(404)
        .json({ message: "Unsuccessful", error: "Order not found" });
      return;
    }

    const invoice = {
      orderId: order._id,
      userId: order.userId,
      totalAmount: order.totalAmount,
      orderItems: order.orderItems,
      deliveryAddress: order.deliveryAddress,
      phoneNumber: order.phoneNumber,
      createdAt: order.createdAt,
    };

    res.status(200).json({ message: "Successful", data: invoice });
  } catch (error: any) {
    logger.error(error);
    res.status(500).json({ message: "Unsuccessful", error: error.message });
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
      res
        .status(404)
        .json({ message: "Unsuccessful", error: "Order not found" });
      return;
    }
    if (order.userId.toString() != userId) {
      res.status(403).json({
        message: "Unsuccessful",
        error: "Order owner is not same as authorized user",
      });
      return;
    }
    if (order.currentStatus === "CANCELED") {
      res
        .status(400)
        .json({ message: "Unsuccessful", error: "Order is already canceled" });
      return;
    }

    order.currentStatus = "CANCELED";

    const inventoryUpdates = order.orderItems.map(async (item) => {
      const { productId, quantity } = item;

      // Update product's current stock
      const product = await Product.findById(productId);
      if (product) {
        product.stock += quantity;
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
    res.status(200).json({ message: "Order has been cancelled", order });
    return;
  } catch (error: any) {
    res.status(500).json({ message: "Unsuccessful", error: error.message });
    return;
  }
};

export const orderStatusChange = async (req: Request, res: Response) => {
  const { id } = req.params;
  const newStatus = req.body.status;

  try {
    const order = await Order.findById(id);
    if (!order) {
      res
        .status(404)
        .json({ message: "Unsuccessful", error: "Order not found" });
      return;
    }
    if (order.currentStatus === "CANCELED") {
      res
        .status(400)
        .json({ message: "Unsuccessful", error: "Order is already canceled" });
      return;
    }

    order.currentStatus = newStatus;

    await order.save();
    res.status(200).json({ message: "Order status has changes", order });
    return;
  } catch (error: any) {
    logger.error(error);
    res.status(500).json({ message: "Unsuccessful", error: error.message });
    return;
  }
};
