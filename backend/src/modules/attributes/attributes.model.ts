import { Document, Schema, model } from "mongoose";

export interface IAttribute extends Document {
  name: string;
  values: string[];
  createdAt: Date;
  updatedAt: Date;
}

const AttributeSchema = new Schema<IAttribute>(
  {
    name: { type: String, required: true },
    values: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

export const Attribute = model<IAttribute>("Attribute", AttributeSchema);
