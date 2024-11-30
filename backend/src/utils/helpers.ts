import jwt from "jsonwebtoken";
import { IUser } from "../modules/auth/auth.model.js";

export function generateUniqueFileName(file: Express.Multer.File): string {
  const timestamp = Date.now();
  const randomSuffix = Math.floor(Math.random() * 10000);
  const sanitizedOriginalName = file.originalname.replace(/\s+/g, "-");
  return `${timestamp}-${randomSuffix}-${sanitizedOriginalName}`;
}

export const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET || "jwtaccesssecret";
export const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "jwtrefreshsecret";

export const generateAccessToken = (user: IUser) => {
  return jwt.sign({ id: user.id, role: user.role }, ACCESS_TOKEN_SECRET);
};
