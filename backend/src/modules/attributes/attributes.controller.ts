import { Request, Response } from "express";
import { Attribute } from "./attributes.model.js";

// Get all attributes
export const getAllAttributes = async (req: Request, res: Response) => {
  try {
    const attributes = await Attribute.find();
    res.json(attributes);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get attribute by ID
export const getAttributeById = async (req: Request, res: Response) => {
  try {
    const attribute = await Attribute.findById(req.params.id);
    if (!attribute) res.status(404).json({ error: "Collection not found" });
    res.json(attribute);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Create new attribute (Admin only)
export const createAttribute = async (req: Request, res: Response) => {
  try {
    const attribute = new Attribute(req.body);
    await attribute.save();
    res.status(201).json(attribute);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
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
    if (!attribute) res.status(404).json({ error: "Attribute not found" });
    res.json(attribute);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Delete attribute by ID (Admin only)
export const deleteAttributeById = async (req: Request, res: Response) => {
  try {
    const attribute = await Attribute.findByIdAndDelete(req.params.id);
    if (!attribute) res.status(404).json({ error: "Attribute not found" });
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
