import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { User } from "../modules/auth/auth.model.js";

const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET || "jwtaccesssecret";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "Access denied. No token provided." });
      return;
    }
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      role: "USER" | "USER_PRO" | "VENDOR" | "ADMIN";
    };
    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(401).json({
        message: "No user with this token.",
        error: "No user with this token.",
      });
      return;
    }

    req.user = { id: user.id, role: user.role };
    next();
  } catch (error) {
    res
      .status(400)
      .json({ message: "Invalid token.", error: (error as Error).message });
    return;
  }
};

export const authorizeUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;
  const id = req.params.id;

  if (userId != id) {
    res.status(403).json({ message: "Access denied." });
  }

  next();
};

export const authorizeAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role != "ADMIN") {
    res
      .status(403)
      .json({ message: "Access denied. Insufficient permissions." });
    return;
  }
  next();
};
