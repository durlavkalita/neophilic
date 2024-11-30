import { Document, Schema, Types, model } from "mongoose";

export interface ICategory extends Document {
  name: string;
  description: string;
  status: "ENABLED" | "DISABLED";
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryData {
  name?: string;
  description?: string;
  status?: "ENABLED" | "DISABLED";
}

const CategorySchema = new Schema<ICategory>(
  {
    _id: {
      type: Types.ObjectId,
      required: true,
      default: () => new Types.ObjectId(),
    },
    name: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ["ENABLED", "DISABLED"], default: "ENABLED" },
  },
  {
    timestamps: true,
  }
);

export const Category = model<ICategory>("Category", CategorySchema);
