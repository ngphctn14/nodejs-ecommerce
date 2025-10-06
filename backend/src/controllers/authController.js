import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_KEY, {
    expiresIn: "1h",
  });
};

export const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email này đã được sử dụng" });
    }

    const user = await User.create({
      fullName,
      email,
      password,
    });

    const token = generateToken(user);
    res.status(201).json({
      message: "Tài khoản đăng ký thành công",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ message: "Thông tin không hợp lệ" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Thông tin không hợp lệ" });
    }


    const token = generateToken(user);
    res.json({
      message: "Đăng nhập thành công",
      token,
      user: {
        id: user._id,
        full_name: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
    console.log(token);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};