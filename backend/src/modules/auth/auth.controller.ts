import { Request, Response } from "express";
import * as authService from "./auth.services.js";
import { User } from "./auth.model.js";
import logger from "../../config/logger.config.js";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const data = await authService.register(email, password);
    if ("error" in data) {
      res.status(400).json({ message: "Unsuccessful", error: data.error });
      return;
    }
    res.status(201).json({ message: "User register successful", data });
    return;
  } catch (error: any) {
    logger.error(error);
    res
      .status(500)
      .json({ message: "User register unsuccessful", error: error.message });
    return;
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const data = await authService.login(email, password);
    if ("error" in data) {
      res.status(400).json({ message: "Unsuccessful", error: data.error });
      return;
    }
    res.status(200).json({ message: "Login Successful", data });
    return;
  } catch (error: any) {
    logger.error(error);
    res
      .status(500)
      .json({ message: "Login Unsuccessful", error: error.message });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id).select("-password");
    if (!user) {
      res
        .status(404)
        .json({ message: "User not found", error: "User not found" });
      return;
    }
    res.status(200).json({ message: "User found", data: user });
    return;
  } catch (error: any) {
    logger.error(error);
    res.status(500).json({ message: "User not found", error: error.message });
    return;
  }
};

export const updateUserById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (id != req.user?.id) {
      res.status(403).json({
        message: "Invalid credentials",
        error: "User id doesn't match authorized id.",
      });
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
    }).select("-password");
    if (!updatedUser) {
      res
        .status(404)
        .json({ message: "User not found", error: "User not found" });
      return;
    }

    res.status(200).json({ message: "Successful", data: updatedUser });
    return;
  } catch (error: any) {
    logger.error(error);
    res.status(500).json({ message: "Unsuccessful", error: error.message });
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
    ).select("-password");
    if (!updatedUser) {
      res
        .status(404)
        .json({ message: "User not found", error: "User not found" });
      return;
    }
    res.status(200).json({ message: "Successful" });
    return;
  } catch (error: any) {
    logger.error(error);
    res.status(500).json({ message: "Unsuccessful", error: error.message });
    return;
  }
};

export const verifyToken = async (req: Request, res: Response) => {
  try {
    const id = req.user?.id;
    const user = await User.findById(id).select("-password");
    if (!user) {
      res
        .status(404)
        .json({ message: "User not found.", error: "User not found" });
      return;
    }
    res.status(200).json({ message: "Successful", data: user });
    return;
  } catch (error: any) {
    logger.error(error);
    res.status(500).json({ message: "Unsuccessful", error: error.message });
    return;
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  try {
    const skip = (page - 1) * limit;
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const total = await User.countDocuments();
    res.status(200).json({
      message: "Successful",
      data: users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalItems: total,
    });
    return;
  } catch (error: any) {
    logger.error(error);
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
    return;
  }
};
