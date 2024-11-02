import { Request, Response } from "express";
import { Attribute } from "./attributes.model.js";

// Get all attributes
export const getAllAttributes = async (req: Request, res: Response) => {
  try {
    const attributes = await Attribute.find();
    res.status(200).json({ message: "Successful", data: attributes });
    return;
  } catch (error: any) {
    res.status(500).json({ error: error.message });
    return;
  }
};

// Get attribute by ID
export const getAttributeById = async (req: Request, res: Response) => {
  try {
    const attribute = await Attribute.findById(req.params.id);
    if (!attribute) {
      res.status(404).json({ error: "Collection not found" });
      return;
    }
    res.status(200).json({ message: "Successful", data: attribute });
    return;
  } catch (error: any) {
    res.status(500).json({ error: error.message });
    return;
  }
};

// Create new attribute (Admin only)
export const createAttribute = async (req: Request, res: Response) => {
  try {
    const { name, values } = req.body;
    const attribute = new Attribute({ name, values });
    await attribute.save();
    res.status(201).json({ message: "Successful", data: attribute });
    return;
  } catch (error: any) {
    res.status(400).json({ error: error.message });
    return;
  }
};

// Update attribute by ID (Admin only)
export const updateAttributeById = async (req: Request, res: Response) => {
  try {
    const attribute = await Attribute.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!attribute) {
      res.status(404).json({ error: "Attribute not found" });
      return;
    }
    res.status(200).json({ message: "Successful", data: attribute });
    return;
  } catch (error: any) {
    res.status(400).json({ error: error.message });
    return;
  }
};

// Delete attribute by ID (Admin only)
export const deleteAttributeById = async (req: Request, res: Response) => {
  try {
    const attribute = await Attribute.findByIdAndDelete(req.params.id);
    if (!attribute) {
      res.status(404).json({ error: "Attribute not found" });
      return;
    }
    res.status(204).json({ message: "Successful" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
    return;
  }
};
