import { Document, Schema, model } from "mongoose";

export interface ICart extends Document {
  userId: Schema.Types.ObjectId | string;
  productId: Schema.Types.ObjectId;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartData {
  userId?: string;
  productId?: string;
  quantity?: number;
}

const CartSchema = new Schema<ICart>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

export const Cart = model<ICart>("Cart", CartSchema);
