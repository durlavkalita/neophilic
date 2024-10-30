import express, { Request, Response } from "express";
import {
  authenticate,
  authorizeAdmin,
} from "../../middleware/auth.middleware.js";
import { seedCategories, seedProducts, seedUsers } from "./scripts.js";

const router = express.Router();

router.get("/user", async (req: Request, res: Response) => {
  try {
    await seedUsers();
    res.status(200).json({ message: "seed success" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/category", async (req: Request, res: Response) => {
  try {
    await seedCategories();
    res.status(200).json({ message: "seed success" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/product", async (req: Request, res: Response) => {
  try {
    await seedProducts();
    res.status(200).json({ message: "seed success" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
