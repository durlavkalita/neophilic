import { Schema, Document, model } from "mongoose";

export interface IOrder extends Document {
  userId: Schema.Types.ObjectId;
  totalAmount: number;
  orderItems: {
    productId: string;
    quantity: number;
    priceAtTime: number;
  }[];
  paymentStatus: "PENDING" | "PAID" | "FAILED";
  paymentMethod: "CREDIT_CARD" | "UPI" | "COD";
  currentStatus: "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELED";
  deliveryAddress: string;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    totalAmount: { type: Number, default: 0 },
    orderItems: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number },
        priceAtTime: { type: Number },
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
    phoneNumber: { type: String, required: true },
  },
  { timestamps: true }
);

export const Order = model<IOrder>("Order", OrderSchema);
