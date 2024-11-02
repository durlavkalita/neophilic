import { Schema, Document, Types, model } from "mongoose";

export interface IOrder extends Document {
  user: Schema.Types.ObjectId;
  totalAmount: string;
  items: any[];
  paymentStatus: "PENDING" | "PAID" | "FAILED";
  paymentMethod: "CREDIT_CARD" | "UPI" | "COD";
  currentStatus: "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELED";
  deliveryAddress: string;
  contactNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    totalAmount: { type: String, required: true },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product" },

        quantity: { type: Number },
        priceAtTime: { type: String },
        _id: false,
      },
    ],
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED"],
      default: "PENDING",
    },
    paymentMethod: {
      type: String,
      enum: ["CREDIT_CARD", "PAYPAL", "COD"],
      default: "COD",
    },
    currentStatus: {
      type: String,
      enum: ["PENDING", "SHIPPED", "DELIVERED", "CANCELED"],
      default: "PENDING",
    },
    deliveryAddress: { type: String, required: true },
    contactNumber: { type: String, required: true },
  },
  { timestamps: true }
);

export const Order = model<IOrder>("Order", OrderSchema);
