import { Request, Response } from "express";
import * as authService from "./auth.services.js";
import { User } from "./auth.model.js";
import jwt from "jsonwebtoken";
import {
  ACCESS_TOKEN_SECRET,
  generateAccessToken,
  REFRESH_TOKEN_SECRET,
} from "./auth.helpers.js";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const data = await authService.register(email, password);
    res.status(201).json({ message: "User registered successfully", data });
    return;
  } catch (error: any) {
    res.status(400).json({ error: error.message });
    return;
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const data = await authService.login(email, password);

    res.status(200).json({ message: "Login Successful", data });
    return;
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }
    const userDetails = {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      image: user.image,
      phoneNumber: user.phoneNumber,
      address: user.address,
      role: user.role,
    };
    res.status(200).json({ message: "Successful", data: userDetails });
    return;
  } catch (error: any) {
    res.status(500).json({ error: error.message });
    return;
  }
};

export const updateUserById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (id != req.user?.id) {
      res.status(403).json({ message: "Invalid credentials" });
      return;
    }

    const { firstName, lastName, address, phoneNumber } = req.body;
    const image = req.file?.filename;

    const updateData: Partial<typeof User.prototype> = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (address) updateData.address = address;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (image) updateData.image = image;

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const userDetails = {
      _id: updatedUser._id,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      image: updatedUser.image,
      phoneNumber: updatedUser.phoneNumber,
      address: updatedUser.address,
      role: updatedUser.role,
    };
    res.status(200).json({ message: "Successful", data: userDetails });
    return;
  } catch (error: any) {
    res.status(500).json({ error: error.message });
    return;
  }
};

export const updateUserRoleById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const role = req.body.role;
    console.log(id, role);

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role: role },
      {
        new: true,
      }
    );
    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json({ message: "Successful" });
    return;
  } catch (error: any) {
    res.status(500).json({ error: error.message });
    return;
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      res.status(401).json({ message: "Refresh token not found" });
      return;
    }

    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as {
      id: string;
      role: "USER" | "USER_PRO" | "VENDOR" | "ADMIN";
    };
    const userId = decoded.id;

    const user = await User.findById(userId);
    if (!user) {
      res.status(403).json({ message: "User not found" });
      return;
    }

    const newAccessToken = generateAccessToken(user);

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: false,
      // secure: process.env.NODE_ENV === "production", // Secure flag for HTTPS in production
      // sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 15 minutes expiration
    });
    const userDetails = {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      image: user.image,
      phoneNumber: user.phoneNumber,
      address: user.address,
      role: user.role,
    };
    res.status(200).json({
      message: "Access token refreshed successfully",
      user: userDetails,
    });
    return;
  } catch (error) {
    res.status(403).json({ message: "Invalid refresh token" });
    return;
  }
};

export const verifyToken = async (req: Request, res: Response) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      res.status(401).json({ message: "No token provided" });
      return;
    }

    const decoded = jwt.verify(accessToken, ACCESS_TOKEN_SECRET) as {
      id: string;
      role: "USER" | "USER_PRO" | "VENDOR" | "ADMIN";
    };
    const userId = decoded.id;
    const user = await User.findById(userId);
    if (!user) {
      res.status(403).json({ message: "User not found" });
      return;
    }
    const userDetails = {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      image: user.image,
      phoneNumber: user.phoneNumber,
      address: user.address,
      role: user.role,
    };
    res.status(200).json({ message: "Token is valid", user: userDetails });
    return;
  } catch (error: any) {
    res.status(401).json({ message: "Invalid token", error: error.message });
    return;
  }
};

export const logout = (req: Request, res: Response) => {
  // Set cookies to expire immediately
  res.clearCookie("accessToken", { httpOnly: true, secure: false });
  res.clearCookie("refreshToken", { httpOnly: true, secure: false });

  res.status(200).json({ message: "Logged out successfully" });
  return;
};
