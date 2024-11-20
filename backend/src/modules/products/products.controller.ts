import { Request, Response } from "express";
import { Product } from "./products.model.js";
import { InventoryHistory } from "../inventory/inventory.model.js";
import logger from "../../config/logger.config.js";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const name = req.body.name;
    const description = req.body.description;
    const basePrice = req.body.basePrice;
    const currentPrice = req.body.currentPrice;
    const sku = req.body.sku;
    const categoryId = req.body.category;
    const stock = Number(req.body.stock);
    const attributes = req.body.attributes;

    const parsedAttributes = JSON.parse(attributes);

    const images = (req.files as any).map(
      (item: { location: any }) => item.location
    );

    const newProduct = new Product({
      name,
      description,
      basePrice,
      currentPrice,
      sku,
      stock,
      attributes: parsedAttributes,
      categoryId,
      images,
    });

    const savedProduct = await newProduct.save();

    const inventoryEntry = new InventoryHistory({
      productId: savedProduct._id,
      quantityChanged: savedProduct.stock,
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
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
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
  try {
    const skip = (page - 1) * limit;
    const products = await Product.find(searchQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const total = await Product.countDocuments();
    res.status(200).json({
      message: "Successful",
      data: products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalItems: total,
    });
    return;
  } catch (error: any) {
    logger.error(error);
    res.status(500).json({ message: "Unsuccessful", error: error.message });
    return;
  }
};

export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      res
        .status(404)
        .json({ message: "Unsuccessful", error: "Product not found" });
      return;
    }
    res.status(200).json({ message: "Successful", data: product });
    return;
  } catch (error: any) {
    logger.error(error);
    res.status(500).json({ message: "Unsuccessful", error: error.message });
    return;
  }
};

export const updateProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  let updates = req.body;
  if ("attributes" in updates) {
    const parsedAttributes = JSON.parse(updates.attributes);
    updates["attributes"] = parsedAttributes;
  }

  try {
    let newImages: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      newImages = (req.files as any).map(
        (item: { location: string }) => item.location
      );
    }
    const product = await Product.findById(id);
    if (!product) {
      res
        .status(404)
        .json({ message: "Unsuccessful", error: "Product not found" });
      return;
    }
    if (newImages.length > 0) {
      updates.images = [...(product.images || []), ...newImages];
    }
    const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
      new: true,
    });
    if (!updatedProduct) {
      res
        .status(404)
        .json({ message: "Unsuccessful", error: "Product not found" });
      return;
    }
    if ("stock" in updates) {
      const inventoryEntry = new InventoryHistory({
        productId: updatedProduct._id,
        quantityChanged: updatedProduct.stock,
        type: "STOCK_ADJUSTMENT",
        referenceId: null,
        notes: "Inventory Updated",
      });
      await inventoryEntry.save();
    }
    res.status(200).json({ message: "Successful", data: updatedProduct });
    return;
  } catch (error: any) {
    logger.error(error);
    res.status(500).json({ message: "Unsuccessful", error: error.message });
    return;
  }
};

export const deleteProductById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      res
        .status(404)
        .json({ message: "Unsuccessful", error: "Product not found" });
      return;
    }
    res.status(204).json({ message: "Product deleted successfully" });
    return;
  } catch (error: any) {
    logger.error(error);
    res.status(500).json({ message: "Unsuccessful", error: error.message });
    return;
  }
};

export const getProductsByCategory = async (req: Request, res: Response) => {
  const { categoryId } = req.params;

  try {
    const products = await Product.find({ categoryId: categoryId }).populate(
      "categoryId"
    );
    if (!products.length) {
      res.status(404).json({
        message: "Unsuccessful",
        error: "No products found for this category",
      });
      return;
    }
    res.status(200).json({ message: "Successful", data: products });
    return;
  } catch (error: any) {
    res.status(500).json({ message: "Unsuccessful", error: error.message });
    return;
  }
};

export const updateProductStatus = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      res
        .status(404)
        .json({ message: "Unsuccessful", error: "Product not found" });
      return;
    }

    product.status = product.status === "ENABLED" ? "DISABLED" : "ENABLED";

    await product.save();

    res.status(200).json({
      message: `Product status updated to ${product.status}`,
      product,
    });
  } catch (error: any) {
    logger.error(error);
    res.status(500).json({ message: "Unsuccessful", error: error.message });
    return;
  }
};

export const searchProducts = async (req: Request, res: Response) => {
  const keyword = req.query.keyword as string;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  if (!keyword) {
    res
      .status(400)
      .json({ message: "Unsuccessful", error: "Search query is required." });
    return;
  }

  try {
    const skip = (page - 1) * limit;
    const products = await Product.find({
      name: { $regex: keyword as string, $options: "i" },
    })
      .populate("categoryId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const total = await Product.countDocuments({
      name: { $regex: keyword as string, $options: "i" },
    });

    res.status(200).json({
      message: "Successful",
      data: products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalItems: total,
    });
    return;
  } catch (error: any) {
    logger.error(error);
    res.status(500).json({ message: "Unsuccessful", error: error.message });
    return;
  }
};
