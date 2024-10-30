import { Document, Schema, Types, model } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  base_price: string;
  current_price: string;
  sku: string;
  currentStock: number;
  thumbnailId: string;
  category: Types.ObjectId;
  attributes: Types.ObjectId[];
  status: "ENABLED" | "DISABLED";
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    base_price: { type: String, required: true },
    current_price: { type: String, required: true },
    sku: { type: String, required: true },
    currentStock: { type: Number, default: 0 },
    thumbnailId: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    attributes: [{ type: Schema.Types.ObjectId, ref: "ProductAttribute" }],
    status: { type: String, enum: ["ENABLED", "DISABLED"], default: "ENABLED" },
  },
  {
    timestamps: true,
  }
);

export const Product = model<IProduct>("Product", ProductSchema);
