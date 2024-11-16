import { Request, Response } from "express";
import { Product } from "../products/products.model.js";
import { Order } from "../orders/orders.model.js";
import { User } from "../auth/auth.model.js";
import logger from "../../config/logger.config.js";

export const getDashboardStatistics = async (req: Request, res: Response) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalCanceledOrders = await Order.countDocuments({
      currentStatus: "CANCELED",
    });
    const totalCustomers = await User.countDocuments({
      $or: [{ role: "USER" }, { role: "USER_PRO" }],
    });

    res.status(200).json({
      message: "Successful",
      data: {
        totalProducts,
        totalOrders,
        totalCanceledOrders,
        totalCustomers,
      },
    });
    return;
  } catch (error: any) {
    logger.error(error);
    res.status(500).json({
      message: "Unsuccessful",
      error: error.message,
    });
    return;
  }
};
