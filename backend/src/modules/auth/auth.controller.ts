import { Request, Response } from "express";
import { User, UserData } from "./auth.model.js";
import logger from "../../config/logger.config.js";
import bcrypt from "bcryptjs";
import { generateAccessToken } from "../../utils/helpers.js";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res
        .status(400)
        .json({ message: "Unsuccessful", error: "User already exists" });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();

    const accessToken = generateAccessToken(user);
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
    res.status(201).json({
      message: "User register successful",
      data: { accessToken, userDetails },
    });
    return;
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      message: "User register unsuccessful",
      error: (error as Error).message,
    });
    return;
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res
        .status(400)
        .json({ message: "Unsuccessful", error: "Invalid credentials" });
      return;
    }

    const accessToken = generateAccessToken(user);
    const userDetails = {
      _id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      image: user.image,
      phoneNumber: user.phoneNumber,
      address: user.address,
      role: user.role,
    };
    res.status(200).json({
      message: "Login Successful",
      data: { accessToken, userDetails },
    });
    return;
  } catch (error) {
    logger.error(error);
    res
      .status(500)
      .json({ message: "Login Unsuccessful", error: (error as Error).message });
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
  } catch (error) {
    logger.error(error);
    res
      .status(500)
      .json({ message: "User not found", error: (error as Error).message });
    return;
  }
};

export const updateUserById = async (req: Request, res: Response) => {
  const userId = req.params.id;
  const { firstName, lastName, address, phoneNumber } = req.body;

  try {
    const reqData: UserData = {};

    if (firstName) reqData.firstName = firstName;
    if (lastName) reqData.lastName = lastName;
    if (address) reqData.address = address;
    if (phoneNumber) reqData.phoneNumber = phoneNumber;
    if (userId != req.user?.id) {
      res.status(403).json({
        message: "Invalid credentials",
        error: "User id doesn't match authorized id.",
      });
      return;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, reqData, {
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
  } catch (error) {
    logger.error(error);
    res
      .status(500)
      .json({ message: "Unsuccessful", error: (error as Error).message });
    return;
  }
};

export const updateUserRoleById = async (req: Request, res: Response) => {
  const userId = req.params.id;
  const role = req.body.role;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
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
  } catch (error) {
    logger.error(error);
    res
      .status(500)
      .json({ message: "Unsuccessful", error: (error as Error).message });
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
  } catch (error) {
    logger.error(error);
    res
      .status(500)
      .json({ message: "Unsuccessful", error: (error as Error).message });
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
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      message: "Error fetching users",
      error: (error as Error).message,
    });
    return;
  }
};
