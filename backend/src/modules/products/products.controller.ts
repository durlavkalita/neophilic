import { Request, Response } from "express";
import { Product } from "./products.model.js";
import { CollectionItem } from "../collections/collections.model.js";
import { InventoryHistory } from "../inventory/inventory.model.js";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const name = req.body.name;
    const description = req.body.description;
    const basePrice = req.body.basePrice;
    const currentPrice = req.body.currentPrice;
    const sku = req.body.sku;
    const category = req.body.category;
    const currentStock = Number(req.body.currentStock);
    const attributes = req.body.attributes;

    const parsedAttributes = JSON.parse(attributes);

    const mainImage = (req.files as any).mainFile[0].filename;
    const images = (req.files as any).files.map(
      (item: { filename: any }) => item.filename
    );

    const newProduct = new Product({
      name,
      description,
      basePrice,
      currentPrice,
      sku,
      currentStock,
      attributes: parsedAttributes,
      category,
      mainImage,
      images,
    });
    const savedProduct = await newProduct.save();

    const inventoryEntry = new InventoryHistory({
      productId: savedProduct._id,
      quantityChanged: savedProduct.currentStock,
      type: "PURCHASE",
      referenceId: null,
      notes: "Product Created",
    });
    await inventoryEntry.save();

    res.status(201).json({ message: "Successful", data: savedProduct });
    return;
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error creating product", error: error.message });
    return;
  }
};

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find().populate("category");
    res.status(200).json({ message: "Successful", data: products });
    return;
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching products", error });
    return;
  }
};

export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id).populate("category");
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.status(200).json({ message: "Successful", data: product });
    return;
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching product", error });
    return;
  }
};

export const updateProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
      new: true,
    });
    if (!updatedProduct) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    if ("currentStock" in updates) {
      const inventoryEntry = new InventoryHistory({
        productId: updatedProduct._id,
        quantityChanged: updatedProduct.currentStock,
        type: "STOCK_ADJUSTMENT",
        referenceId: null,
        notes: "Inventory Updated",
      });
      await inventoryEntry.save();
    }
    res.status(200).json({ message: "Successful", data: updatedProduct });
    return;
  } catch (error: any) {
    res.status(500).json({ message: "Error updating product", error });
    return;
  }
};

export const deleteProductById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.status(200).json({ message: "Product deleted successfully" });
    return;
  } catch (error: any) {
    res.status(500).json({ message: "Error deleting product", error });
    return;
  }
};

export const getProductsByCategory = async (req: Request, res: Response) => {
  const { categoryId } = req.params;

  try {
    const products = await Product.find({ category: categoryId })
      .populate("category")
      .populate("attributes");
    if (!products.length) {
      res.status(404).json({ message: "No products found for this category" });
      return;
    }
    res.status(200).json({ message: "Successful", data: products });
    return;
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching products by category", error });
    return;
  }
};

export const getProductsByCollection = async (req: Request, res: Response) => {
  const { collectionId } = req.params;

  try {
    const collectionItem = await CollectionItem.findById(collectionId).populate(
      "products"
    );
    if (!collectionItem?.products.length) {
      res
        .status(404)
        .json({ message: "No products found for this collection" });
      return;
    }

    res
      .status(200)
      .json({ message: "Successful", data: collectionItem.products });
    return;
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching products by collection", error });
    return;
  }
};

export const updateProductStatus = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    product.status = product.status === "ENABLED" ? "DISABLED" : "ENABLED";

    await product.save();

    res.status(200).json({
      message: `Product status updated to ${product.status}`,
      product,
    });
  } catch (error: any) {
    res.status(500).json({ message: "Error updating product status", error });
    return;
  }
};

export const searchProducts = async (req: Request, res: Response) => {
  const { query } = req.query;

  if (!query) {
    res.status(400).json({ message: "Search query is required." });
    return;
  }

  try {
    // Find products where 'name' matches the search term, case-insensitive
    const products = await Product.find({
      name: { $regex: query as string, $options: "i" },
    });

    res.status(200).json({ message: "Successful", data: products });
    return;
  } catch (error: any) {
    res.status(500).json({ message: "Server error. Please try again later." });
    return;
  }
};
