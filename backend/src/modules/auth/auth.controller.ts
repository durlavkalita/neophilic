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
    const { accessToken, refreshToken, userDetails } =
      await authService.register(email, password);
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false, // Use true if in production with HTTPS
      // sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours for access token
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // Use true if in production with HTTPS
      // sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days for refresh token
    });
    res
      .status(201)
      .json({ message: "User registered successfully", userDetails });
    return;
  } catch (error: any) {
    res.status(400).json({ error: error.message });
    return;
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken, userDetails } = await authService.login(
      email,
      password
    );
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true, // Use true if in production with HTTPS
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours for access token
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true, // Use true if in production with HTTPS
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days for refresh token
    });
    res.status(200).json({ message: "Login Successful", userDetails });
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
    // Extract the refresh token from cookies
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      res.status(401).json({ message: "Refresh token not found" });
      return;
    }

    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as {
      id: string;
      role: "USER" | "USER_PRO" | "VENDOR" | "ADMIN";
    };
    const userId = decoded.id;

    // Ensure the user exists and is authorized to refresh
    const user = await User.findById(userId);
    if (!user) {
      res.status(403).json({ message: "User not found" });
      return;
    }

    // Generate a new access token
    const newAccessToken = generateAccessToken(user);

    // Send the new access token in an HTTP-only, secure cookie
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: false,
      // secure: process.env.NODE_ENV === "production", // Secure flag for HTTPS in production
      // sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 15 minutes expiration
    });

    res.status(200).json({ message: "Access token refreshed successfully" });
    return;
  } catch (error) {
    res.status(403).json({ message: "Invalid refresh token" });
    return;
  }
};

export const verifyToken = (req: Request, res: Response) => {
  const accessToken = req.cookies.accessToken; // Assuming you stored the token in a cookie

  if (!accessToken) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
    res.status(200).json({ message: "Token is valid", user: decoded });
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
