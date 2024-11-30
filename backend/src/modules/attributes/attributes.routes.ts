import express from "express";
import {
  getAllAttributes,
  getAttributeById,
  createAttribute,
  updateAttributeById,
} from "./attributes.controller.js";
import {
  authenticate,
  authorizeAdmin,
} from "../../middleware/auth.middleware.js";
import {
  validateCreateAttribute,
  validateUpdateAttribute,
} from "./attributes.validators.js";

const router = express.Router();

router.get("/", getAllAttributes);
router.post(
  "/",
  authenticate,
  authorizeAdmin,
  validateCreateAttribute,
  createAttribute
);
router.get("/:id", getAttributeById);
router.put(
  "/:id",
  authenticate,
  authorizeAdmin,
  validateUpdateAttribute,
  updateAttributeById
);

export default router;
