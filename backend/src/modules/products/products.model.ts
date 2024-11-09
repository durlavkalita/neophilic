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
  attributes: {};
  status: "ENABLED" | "DISABLED";
  rating: number;
  createdAt: Date;
  updatedAt: Date;
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
    categoryId: { type: Schema.Types.ObjectId, ref: "Category", index: true },
    attributes: {
      type: Map,
      of: String,
    },
    status: { type: String, enum: ["ENABLED", "DISABLED"], default: "ENABLED" },
    rating: { type: Number },
  },
  {
    timestamps: true,
  }
);

export const Product = model<IProduct>("Product", ProductSchema);
