import express from "express";
import {
  getAllAttributes,
  getAttributeById,
  createAttribute,
  updateAttributeById,
  deleteAttributeById,
} from "./attributes.controller.js";
import {
  authenticate,
  authorizeAdmin,
} from "../../middleware/auth.middleware.js";
import { validateAttribute } from "./attributes.validators.js";

const router = express.Router();

router.get("/", getAllAttributes);
router.get("/:id", getAttributeById);
router.post(
  "/",
  authenticate,
  authorizeAdmin,
  validateAttribute,
  createAttribute
);
router.put("/:id", authenticate, authorizeAdmin, updateAttributeById);
router.delete("/:id", authenticate, authorizeAdmin, deleteAttributeById);

export default router;
