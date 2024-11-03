import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET || "jwtaccesssecret";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      res.status(401).json({ message: "Access denied. No token provided." });
      return;
    }
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      role: "USER" | "USER_PRO" | "VENDOR" | "ADMIN";
    };
    const user = { id: decoded.id, role: decoded.role };

    if (!user) {
      res.status(401).json({ message: "Invalid token." });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
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
  const userRole = req.user?.role;
  if (!userRole || userRole != "ADMIN") {
    res
      .status(403)
      .json({ message: "Access denied. Insufficient permissions." });
  }
  next();
};
