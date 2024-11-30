import { Document, Schema, model } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  role: "USER" | "USER_PRO" | "VENDOR" | "ADMIN";
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserData {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  address?: string;
  image?: string;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["USER", "USER_PRO", "VENDOR", "ADMIN"],
      default: "USER",
    },
    firstName: { type: String, default: null },
    lastName: { type: String, default: null },
    phoneNumber: { type: String, default: null },
    address: { type: String, default: null },
    image: { type: String },
  },
  { timestamps: true }
);

export const User = model<IUser>("User", UserSchema);
