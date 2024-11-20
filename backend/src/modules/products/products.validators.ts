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
    .isFloat({ gt: 0 })
    .withMessage("Base Price must be a positive number.")
    .notEmpty()
    .withMessage("Base Price is required."),

  body("currentPrice")
    .isFloat({ gt: 0 })
    .withMessage("Current Price must be a positive number.")
    .notEmpty()
    .withMessage("Current Price is required."),

  body("sku")
    .isString()
    .withMessage("SKU must be a string.")
    .notEmpty()
    .withMessage("SKU is required."),

  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer."),

  body("images")
    .optional()
    .isArray()
    .withMessage("Images must be an array of strings.")
    .custom((images: any[]) =>
      images.every((img: any) => typeof img === "string")
    )
    .withMessage("Each image must be a string."),

  body("categoryId")
    .optional()
    .isMongoId()
    .withMessage("Category ID must be a valid ObjectId."),

  body("attributes")
    .optional()
    .isObject()
    .withMessage("Attributes must be an object.")
    .custom((attributes: { [s: string]: unknown } | ArrayLike<unknown>) =>
      Object.values(attributes).every((val) => typeof val === "string")
    )
    .withMessage("Each attribute value must be a string."),

  body("status")
    .optional()
    .isIn(["ENABLED", "DISABLED"])
    .withMessage("Status must be either 'ENABLED' or 'DISABLED'."),

  body("rating")
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage("Rating must be a number between 0 and 5."),

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
