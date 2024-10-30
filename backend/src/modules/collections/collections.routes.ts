import express from "express";
import {
  getAllCollectionItems,
  getCollectionItemById,
  createCollectionItem,
  updateCollectionItemById,
  deleteCollectionItemById,
} from "./collections.controller.js";
import {
  authenticate,
  authorizeAdmin,
} from "../../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getAllCollectionItems);
router.get("/:id", getCollectionItemById);
router.post("/", authenticate, authorizeAdmin, createCollectionItem);
router.put("/:id", authenticate, authorizeAdmin, updateCollectionItemById);
router.delete("/:id", authenticate, authorizeAdmin, deleteCollectionItemById);

export default router;
