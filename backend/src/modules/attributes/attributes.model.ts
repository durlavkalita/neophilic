import { Document, Schema, model } from "mongoose";

export interface IAttribute extends Document {
  name: string;
  values: string[];
  status: "ENABLED" | "DISABLED";
  createdAt: Date;
  updatedAt: Date;
}

export interface AttributeData {
  name?: string;
  values?: string[];
  status?: "ENABLED" | "DISABLED";
}

const AttributeSchema = new Schema<IAttribute>(
  {
    name: { type: String, required: true },
    values: [{ type: String }],
    status: { type: String, enum: ["ENABLED", "DISABLED"], default: "ENABLED" },
  },
  {
    timestamps: true,
  }
);

export const Attribute = model<IAttribute>("Attribute", AttributeSchema);
