import { Document, Schema, Types, model } from "mongoose";

export interface ICart extends Document {
  userId: Types.ObjectId;
  productId: Schema.Types.ObjectId;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

const CartSchema = new Schema<ICart>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

export const Cart = model<ICart>("Cart", CartSchema);
