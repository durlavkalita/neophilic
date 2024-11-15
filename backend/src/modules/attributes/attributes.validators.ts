import { body } from "express-validator";

export const validateAttribute = [
  body("name").notEmpty().withMessage("Enter a valid attribute name"),
];
