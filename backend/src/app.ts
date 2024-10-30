import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import { errorHandler } from "./middleware/error.middleware.js";
import { connectToMongoDB } from "./config/db.config.js";
import authRoutes from "./modules/auth/auth.routes.js";
import categoryRoutes from "./modules/categories/categories.routes.js";
import collectionItemRoutes from "./modules/collections/collections.routes.js";
import attributeRoutes from "./modules/attributes/attributes.routes.js";
import productRoutes from "./modules/products/products.routes.js";
import cartRoutes from "./modules/cart/cart.routes.js";
import orderRoutes from "./modules/orders/orders.routes.js";

const app = express();

// middleware setup
app.use(cors());
app.use(express.json());

connectToMongoDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/collections", collectionItemRoutes);
app.use("/api/attributes", attributeRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);

// app.use((req, res, next) => {
//   const error = new Error("Not Found");
//   (error as any).statusCode = 404;
//   next(error);
// });

app.use(errorHandler);

export default app;
