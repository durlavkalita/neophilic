import { Request, Response } from "express";
import { CollectionItem } from "./collections.model.js";

export const getAllCollectionItems = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string);
  const limit = parseInt(req.query.limit as string);
  if (!page && !limit) {
    try {
      const collectionItems = await CollectionItem.find();
      res.status(200).json({ message: "Successful", data: collectionItems });
      return;
    } catch (error: any) {
      res.status(500).json({ error: error.message });
      return;
    }
  } else {
    try {
      const skip = (page - 1) * limit;
      const collectionItems = await CollectionItem.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      const total = await CollectionItem.countDocuments();
      res.status(200).json({
        message: "Successful",
        data: collectionItems,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        totalItems: total,
      });
      return;
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Error fetching collectionItems", error });
      return;
    }
  }
};

export const getCollectionItemById = async (req: Request, res: Response) => {
  try {
    const collectionItem = await CollectionItem.findById(
      req.params.id
    ).populate("products");
    if (!collectionItem) {
      res.status(404).json({ error: "Collection not found" });
      return;
    }
    res.status(200).json({ message: "Successful", data: collectionItem });
    return;
  } catch (error: any) {
    res.status(500).json({ error: error.message });
    return;
  }
};

export const createCollectionItem = async (req: Request, res: Response) => {
  try {
    const collectionItem = new CollectionItem(req.body);
    await collectionItem.save();
    res.status(201).json({ message: "Successful", data: collectionItem });
    return;
  } catch (error: any) {
    res.status(400).json({ error: error.message });
    return;
  }
};

export const updateCollectionItemById = async (req: Request, res: Response) => {
  try {
    const collectionItem = await CollectionItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!collectionItem) {
      res.status(404).json({ error: "CollectionItem not found" });
      return;
    }
    res.status(200).json({ message: "Successful", data: collectionItem });
    return;
  } catch (error: any) {
    res.status(400).json({ error: error.message });
    return;
  }
};

export const deleteCollectionItemById = async (req: Request, res: Response) => {
  try {
    const collectionItem = await CollectionItem.findByIdAndDelete(
      req.params.id
    );
    if (!collectionItem) {
      res.status(404).json({ error: "CollectionItem not found" });
      return;
    }
    res.status(204).send({ message: "Successful" });
    return;
  } catch (error: any) {
    res.status(500).json({ error: error.message });
    return;
  }
};
