import { Request, Response } from "express";
import { rateLimit } from "express-rate-limit";
import logger from "../config/logger.config.js";

export const appRateLimiter = rateLimit({
  skip: (req) => req.ip === "127.0.0.1",
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: "Too many requests. Please wait before retrying.",
  },
  handler: (req: Request, res: Response) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      error: "Too many requests. Please wait before retrying",
    });
    return;
  },
});

export const authRateLimiter = rateLimit({
  skip: (req) => req.ip === "127.0.0.1",
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
  },
  handler: (req: Request, res: Response) => {
    logger.warn(`Auth rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      error: "Too many login attempts. Please try again later",
    });
    return;
  },
});
