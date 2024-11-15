import bcrypt from "bcryptjs";
import { User } from "./auth.model.js";
import { generateAccessToken, generateRefreshToken } from "./auth.helpers.js";

export const register = async (email: string, password: string) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return { error: "User already exists" };
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hashedPassword });
  await user.save();

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
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
  return { accessToken, refreshToken, userDetails };
};

export const login = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return { error: "Invalid credentials" };
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
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
  return { accessToken, refreshToken, userDetails };
};
