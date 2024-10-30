import { Request, Response } from "express";
import { Order, OrderItem, OrderStatusHistory } from "./orders.model.js";

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const order = await Order.find();
    if (!order) res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createOrder = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  console.log(req.user);

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
    const items = await Promise.all(
      orderItems.map(
        async (item: { productId: any; quantity: any; priceAtTime: any }) => {
          const { productId, quantity, priceAtTime } = item;
          totalAmount += quantity * Number(priceAtTime);
        }
      )
    );

    // Create the order
    const order = new Order({
      user: userId,
      items: orderItems,
      totalAmount,
      deliveryAddress,
      contactNumber,
      paymentStatus: paymentStatus || "PENDING",
      paymentMethod: paymentMethod || "COD",
      currentStatus: currentStatus || "PENDING",
    });

    await order.save();
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
    if (!order) res.status(404).json({ message: "Order not found" });

    res.status(200).json({ message: "Successful", data: order });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getOrderByUserId = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const orders = await Order.find({ userId });
    if (!orders.length)
      res.status(404).json({ message: "No orders found for this user" });

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

    res.json(invoice);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
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

    order.currentStatus = "CANCELED";

    await order.save();
    res.json({ message: "Order has been cancelled", order });
    return;
  } catch (error: any) {
    res.status(500).json({ error: error.message });
    return;
  }
};
