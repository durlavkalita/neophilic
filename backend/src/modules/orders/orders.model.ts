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

export interface IOrderItem extends Document {
  orderId: Schema.Types.ObjectId;
  productId: Schema.Types.ObjectId;
  quantity: number;
  priceAtTime: string;
  createdAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true },
    priceAtTime: { type: String, required: true },
  },
  { timestamps: true }
);

export interface IOrderStatusHistory extends Document {
  orderId: Schema.Types.ObjectId;
  status: "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELED";
  updatedBy: Schema.Types.ObjectId;
  notes?: string;
  createdAt: Date;
}

const OrderStatusHistorySchema = new Schema<IOrderStatusHistory>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    status: {
      type: String,
      enum: ["PENDING", "SHIPPED", "DELIVERED", "CANCELED"],
      default: "PENDING",
    },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    notes: { type: String },
  },
  { timestamps: { createdAt: "created_at" } }
);

export const OrderStatusHistory = model<IOrderStatusHistory>(
  "OrderStatusHistory",
  OrderStatusHistorySchema
);

export const OrderItem = model<IOrderItem>("OrderItem", OrderItemSchema);

export const Order = model<IOrder>("Order", OrderSchema);
