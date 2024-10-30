import mongoose from "mongoose";
import "dotenv/config";

export const connectToMongoDB = async () => {
  try {
    const dbUri =
      process.env.MONGODB_URI ||
      "mongodb://root:password@mongodb:27017/ecommerce?authSource=admin";
    await mongoose.connect(dbUri);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};
