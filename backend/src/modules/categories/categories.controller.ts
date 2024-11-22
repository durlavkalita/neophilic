import { Request, Response } from "express";
import { Category } from "./categories.model.js";
import logger from "../../config/logger.config.js";

export const getAllCategories = async (req: Request, res: Response) => {
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
      const categories = await Category.find(searchQuery);
      res.status(200).json({ message: "Successful", data: categories });
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
      const categories = await Category.find(searchQuery)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      const total = await Category.countDocuments();
      res.status(200).json({
        message: "Successful",
        data: categories,
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

export const getCategoryById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const category = await Category.findById(id);
    if (!category) {
      res
        .status(404)
        .json({ message: "Category not found", error: "Category not found" });
      return;
    }
    res.status(200).json({ message: "Successful", data: category });
    return;
  } catch (error) {
    logger.error(error);
    res
      .status(500)
      .json({ message: "Unsuccessful", error: (error as Error).message });
    return;
  }
};

export const createCategory = async (req: Request, res: Response) => {
  const { name, description } = req.body;
  try {
    const newCategory = new Category({ name, description });
    await newCategory.save();
    res.status(201).json({ message: "Successful", data: newCategory });
    return;
  } catch (error) {
    logger.error(error);
    res
      .status(500)
      .json({ message: "Unsuccessful", error: (error as Error).message });
    return;
  }
};

export const updateCategoryById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;
  try {
    const updatedCategory = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updatedCategory) {
      res
        .status(404)
        .json({ message: "Category not found", error: "Category not found" });
      return;
    }
    res.status(200).json({ message: "Successful", data: updatedCategory });
    return;
  } catch (error) {
    logger.error(error);
    res
      .status(500)
      .json({ message: "Unsuccessful", error: (error as Error).message });
    return;
  }
};
