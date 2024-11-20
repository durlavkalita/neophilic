import { fileURLToPath } from "url";
import path from "path";
import jwt from "jsonwebtoken";
import { IUser } from "../modules/auth/auth.model.js";

export const getRootDir = () => {
  // console.log(import.meta.url);
  // console.log(fileURLToPath(import.meta.url));
  // console.log(path.dirname(fileURLToPath(import.meta.url)));
  const rootPath = path.dirname(fileURLToPath(import.meta.url));

  return rootPath;
};

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
