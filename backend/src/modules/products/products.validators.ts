import { NextFunction, Request, Response } from "express";

import { body, validationResult } from "express-validator";

export const validateProduct = [
  body("name")
    .isString()
    .withMessage("Name must be a string.")
    .notEmpty()
    .withMessage("Name is required."),

  body("description")
    .isString()
    .withMessage("Description must be a string.")
    .notEmpty()
    .withMessage("Description is required."),

  body("basePrice")
    .isInt({ min: 0 })
    .withMessage("Base Price must be a positive number.")
    .notEmpty()
    .withMessage("Base Price is required."),

  body("sku")
    .isString()
    .withMessage("SKU must be a string.")
    .notEmpty()
    .withMessage("SKU is required."),

  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer."),

  body("categoryId")
    .isMongoId()
    .withMessage("Category ID must be a valid ObjectId.")
    .notEmpty()
    .withMessage("Category is required."),

  body("status")
    .optional()
    .isIn(["ENABLED", "DISABLED"])
    .withMessage("Status must be either 'ENABLED' or 'DISABLED'."),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        message: "Unsuccessful, validation error",
        errors: errors.array(),
      });
      return;
    }
    next();
  },
];
