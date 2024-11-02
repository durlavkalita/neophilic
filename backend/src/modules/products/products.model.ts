import { Document, Schema, Types, model } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  basePrice: string;
  currentPrice: string;
  sku: string;
  currentStock: number;
  mainImage: string;
  images: string[];
  category: Types.ObjectId;
  attributes: {
    name: string;
    value: string;
  }[];
  status: "ENABLED" | "DISABLED";
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    basePrice: { type: String, required: true },
    currentPrice: { type: String, required: true },
    sku: { type: String, required: true },
    currentStock: { type: Number, default: 0 },
    mainImage: { type: String },
    images: [{ type: String }],
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    attributes: [
      {
        name: String,
        value: String,
        _id: false,
      },
    ],
    status: { type: String, enum: ["ENABLED", "DISABLED"], default: "ENABLED" },
  },
  {
    timestamps: true,
  }
);

export const Product = model<IProduct>("Product", ProductSchema);
