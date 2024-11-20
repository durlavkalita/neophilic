import { Document, Schema, model } from "mongoose";

export interface ICategory extends Document {
  name: string;
  description: string;
  status: "ENABLED" | "DISABLED";
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ["ENABLED", "DISABLED"], default: "ENABLED" },
  },
  {
    timestamps: true,
  }
);

export const Category = model<ICategory>("Category", CategorySchema);
