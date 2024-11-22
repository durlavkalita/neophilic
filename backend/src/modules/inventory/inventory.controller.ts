import { Request, Response } from "express";
import { InventoryHistory } from "./inventory.model.js";
import logger from "../../config/logger.config.js";

export const getInventoryHistory = async (req: Request, res: Response) => {
  const productId = req.params.productId;
  const type = req.query.type;
  let searchQuery;
  if (type) {
    searchQuery = { productId: productId, type: type };
  } else {
    searchQuery = { productId: productId };
  }

  try {
    const histories = await InventoryHistory.find(searchQuery);
    res.status(200).json({ message: "Successful", data: histories });
    return;
  } catch (error) {
    logger.error(error);
    res
      .status(500)
      .json({ message: "Unsuccessful", error: (error as Error).message });
    return;
  }
};
