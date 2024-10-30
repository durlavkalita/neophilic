import { Document, Schema, Types, model } from "mongoose";

export interface ICollectionItem extends Document {
  name: string;
  description: string;
  startDate?: Date | null;
  endDate?: Date | null;
  products: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const CollectionItemSchema = new Schema<ICollectionItem>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  },
  {
    timestamps: true,
  }
);

export const CollectionItem = model<ICollectionItem>(
  "CollectionItem",
  CollectionItemSchema
);
