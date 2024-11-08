import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/error.middleware.js";
import { connectToMongoDB } from "./config/db.config.js";
import authRoutes from "./modules/auth/auth.routes.js";
import categoryRoutes from "./modules/categories/categories.routes.js";
import collectionItemRoutes from "./modules/collections/collections.routes.js";
import attributeRoutes from "./modules/attributes/attributes.routes.js";
import productRoutes from "./modules/products/products.routes.js";
import cartRoutes from "./modules/cart/cart.routes.js";
import orderRoutes from "./modules/orders/orders.routes.js";
import seedRoutes from "./modules/seed/routes.js";

const app = express();

// middleware setup
// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     credentials: true, // Allows cookies to be sent with requests
//   })
// );
app.use(cors());

// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');  // Specific origin
//   res.setHeader('Access-Control-Allow-Credentials', 'true');
//   res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
//   next();
// });
app.use(express.json());
app.use(cookieParser());

connectToMongoDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/collections", collectionItemRoutes);
app.use("/api/attributes", attributeRoutes);
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/seed", seedRoutes);

// app.use(
//   "/uploads/products",
//   express.static(path.join(getRootDir(), "/dist/uploads/products"))
// );
// app.use(
//   "/uploads/users",
//   express.static(path.join(getRootDir(), "/uploads/users"))
// );
app.use(express.static("uploads/products"));
app.use(errorHandler);

export default app;
