import jwt from "jsonwebtoken";
import { IUser } from "./auth.model.js";

export const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET || "jwtaccesssecret";
export const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "jwtrefreshsecret";

export const generateAccessToken = (user: IUser) => {
  return jwt.sign({ id: user.id, role: user.role }, ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

export const generateRefreshToken = (user: IUser) => {
  return jwt.sign({ id: user.id }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};
