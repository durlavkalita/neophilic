import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

export const validateCategory = [
  body("name").notEmpty().withMessage("Enter a valid category name"),
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
