import { Document, Schema, Types, model } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  basePrice: number;
  currentPrice: number;
  sku: string;
  stock: number;
  images: string[] | null;
  categoryId: Types.ObjectId;
  attributes: Map<string, string>;
  status: "ENABLED" | "DISABLED";
  ratingTotal: number;
  ratingCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductData {
  name?: string;
  description?: string;
  basePrice?: number;
  currentPrice?: number;
  sku?: string;
  stock?: number;
  images?: string[] | null;
  categoryId?: Types.ObjectId;
  attributes?: Map<string, string>;
  status?: "ENABLED" | "DISABLED";
  ratingTotal?: number;
  ratingCount?: number;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    basePrice: { type: Number, required: true },
    currentPrice: { type: Number, required: true },
    sku: { type: String, required: true, unique: true },
    stock: { type: Number, default: 0 },
    images: [{ type: String }],
    categoryId: {
      type: Schema.Types.Mixed,
      ref: "Category",
      index: true,
      required: true,
    },
    attributes: {
      type: Map,
      of: String,
    },
    status: { type: String, enum: ["ENABLED", "DISABLED"], default: "ENABLED" },
    ratingTotal: { type: Number },
    ratingCount: { type: Number },
  },
  {
    timestamps: true,
  }
);

export const Product = model<IProduct>("Product", ProductSchema);
