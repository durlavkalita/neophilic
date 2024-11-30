import { Document, Schema, model } from "mongoose";

export interface IReview extends Document {
  userId: Schema.Types.ObjectId | string;
  productId: Schema.Types.ObjectId | string;
  orderId: Schema.Types.ObjectId | string;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    rating: { type: Number, default: 0 },
    comment: { type: String },
  },
  {
    timestamps: true,
  }
);

export const Review = model<IReview>("Review", ReviewSchema);
