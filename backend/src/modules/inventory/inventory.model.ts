import mongoose, { Schema, Document } from "mongoose";

export interface IInventoryHistory extends Document {
  productId: Schema.Types.ObjectId;
  quantityChanged: number;
  quantityTotal: number;
  type: "STOCK_ADJUSTMENT" | "SALE" | "PURCHASE" | "RETURN";
  referenceId: Schema.Types.ObjectId;
  notes?: string;
  createdAt: Date;
}

const InventoryHistorySchema = new Schema<IInventoryHistory>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantityChanged: { type: Number, required: true },
    quantityTotal: { type: Number, required: true },
    type: {
      type: String,
      enum: ["STOCK_ADJUSTMENT", "SALE", "PURCHASE", "RETURN"],
      required: true,
    },
    referenceId: { type: Schema.Types.ObjectId },
    notes: { type: String },
  },
  { timestamps: true }
);

export const InventoryHistory = mongoose.model<IInventoryHistory>(
  "InventoryHistory",
  InventoryHistorySchema
);
