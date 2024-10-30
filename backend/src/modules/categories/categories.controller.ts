import { Request, Response } from "express";
import { Category } from "./categories.model.js";

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ message: "Successful", data: categories });
    return;
  } catch (error: any) {
    res.status(500).json({ error: error.message });
    return;
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const category = await Category.findById(id);
    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }
    res.status(200).json({ message: "Successful", data: category });
    return;
  } catch (error: any) {
    res.status(500).json({ message: "Failed to retrieve category" });
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
  } catch (error: any) {
    res.status(400).json({ message: "Failed to create category" });
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
      res.status(404).json({ message: "Category not found" });
      return;
    }
    res.status(200).json({ message: "Successful", data: updatedCategory });
    return;
  } catch (error: any) {
    res.status(400).json({ message: "Failed to update category" });
    return;
  }
};

export const deleteCategoryById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      res.status(404).json({ message: "Category not found" });
      return;
    }
    res.status(204).json({ message: "Successful" });
    return;
  } catch (error: any) {
    res.status(500).json({ message: "Failed to delete category" });
    return;
  }
};
