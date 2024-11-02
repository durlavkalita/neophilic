import bcrypt from "bcryptjs";
import { IUser, User } from "./auth.model.js";
import { generateAccessToken, generateRefreshToken } from "./auth.helpers.js";

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  userDetails: {
    email: string;
    firstName: string;
    lastName: string;
    image: string;
    phoneNumber: string;
    address: string;
    role: string;
  };
}

export const register = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hashedPassword });
  await user.save();

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  const userDetails = {
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    image: user.image,
    phoneNumber: user.phoneNumber,
    address: user.address,
    role: user.role,
  };
  return { accessToken, refreshToken, userDetails };
};

export const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error("Invalid credentials");
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  const userDetails = {
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    image: user.image,
    phoneNumber: user.phoneNumber,
    address: user.address,
    role: user.role,
  };
  return { accessToken, refreshToken, userDetails };
};
