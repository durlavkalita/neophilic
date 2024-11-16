import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import { errorHandler } from "./middleware/error.middleware.js";
import { connectToMongoDB } from "./config/db.config.js";
import authRoutes from "./modules/auth/auth.routes.js";
import categoryRoutes from "./modules/categories/categories.routes.js";
import attributeRoutes from "./modules/attributes/attributes.routes.js";
import productRoutes from "./modules/products/products.routes.js";
import cartRoutes from "./modules/cart/cart.routes.js";
import orderRoutes from "./modules/orders/orders.routes.js";
import { seedCartsAndOrder } from "./utils/seedScripts.js";
import statisticRoutes from "./modules/statistics/statistics.routes.js";
import inventoryRoutes from "./modules/inventory/inventory.routes.js";
import logger from "./config/logger.config.js";

const app = express();

app.use(cors());
app.use(express.json());

connectToMongoDB();

app.get("/", (req: Request, res: Response) => {
  logger.info("hello world");
  res.send("Hello World");
});

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/attributes", attributeRoutes);
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/statistics", statisticRoutes);
app.use("/api/inventory", inventoryRoutes);
app.get("/api/seed", async (req: Request, res: Response) => {
  try {
    await seedCartsAndOrder();
    res.status(200).json({ message: "seed success" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.use(express.static("uploads/products"));
app.use(errorHandler);

export default app;
