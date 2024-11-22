import { Request, Response } from "express";
import { Attribute } from "./attributes.model.js";
import logger from "../../config/logger.config.js";

export const getAllAttributes = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string);
  const limit = parseInt(req.query.limit as string);
  const status = req.query.status;
  let searchQuery;
  if (status) {
    if (status == "all") {
      searchQuery = {};
    } else {
      searchQuery = { status: status };
    }
  } else {
    searchQuery = { status: "ENABLED" };
  }
  if (!page && !limit) {
    try {
      const attributes = await Attribute.find(searchQuery);
      res.status(200).json({ message: "Successful", data: attributes });
      return;
    } catch (error) {
      logger.error(error);
      res
        .status(500)
        .json({ message: "Unsuccessful", error: (error as Error).message });
      return;
    }
  } else {
    try {
      const skip = (page - 1) * limit;
      const attributes = await Attribute.find(searchQuery)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      const total = await Attribute.countDocuments();
      res.status(200).json({
        message: "Successful",
        data: attributes,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        totalItems: total,
      });
      return;
    } catch (error) {
      logger.error(error);
      res
        .status(500)
        .json({ message: "Unsuccessful", error: (error as Error).message });
      return;
    }
  }
};

export const getAttributeById = async (req: Request, res: Response) => {
  try {
    const attribute = await Attribute.findById(req.params.id);
    if (!attribute) {
      res
        .status(404)
        .json({ message: "Attribute not found", error: "Attribute not found" });
      return;
    }
    res.status(200).json({ message: "Successful", data: attribute });
    return;
  } catch (error) {
    logger.error(error);
    res
      .status(500)
      .json({ message: "Unsuccessful", error: (error as Error).message });
    return;
  }
};

export const createAttribute = async (req: Request, res: Response) => {
  try {
    const { name, values } = req.body;
    const attribute = new Attribute({ name, values });
    await attribute.save();
    res.status(201).json({ message: "Successful", data: attribute });
    return;
  } catch (error) {
    logger.error(error);
    res
      .status(500)
      .json({ message: "Unsuccessful", error: (error as Error).message });
    return;
  }
};

export const updateAttributeById = async (req: Request, res: Response) => {
  try {
    const attribute = await Attribute.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!attribute) {
      res
        .status(404)
        .json({ message: "Attribute not found", error: "Attribute not found" });
      return;
    }
    res.status(200).json({ message: "Successful", data: attribute });
    return;
  } catch (error) {
    logger.error(error);
    res
      .status(500)
      .json({ message: "Unsuccessful", error: (error as Error).message });
    return;
  }
};
