import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import passport from "passport";

import User from "../models/userModel.js";
import Cart from "../models/cartModel.js";

import { sendVerificationEmail } from "../config/mailer.js";

dotenv.config();

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_KEY, {
    expiresIn: "7d",
  });
};

export const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    let user = await User.findOne({ email });

    if (user && user.isVerified) {
      return res.status(400).json({ message: "Email này đã được sử dụng" });
    }

    if (user && !user.isVerified) {
      console.log(user.fullName);
      user.fullName = fullName;
      user.password = password;
      await user.save();
    }

    if (!user) {
      user = await User.create({ fullName, email, password });
      await Cart.create({ userId: user._id });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.EMAIL_KEY,
      { expiresIn: "1d" }
    );

    await sendVerificationEmail(user, token);

    res.status(201).json({
      message:
        "Tài khoản được đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi máy chủ" });
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

    if (!user.isVerified) {
      return res
        .status(401)
        .json({ message: "Vui lòng xác thực email trước khi đăng nhập" });
    }

    const token = generateToken(user);

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Đăng nhập thành công",
      user: {
        id: user._id,
        full_name: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("accessToken");
  res.json({ message: "Đăng xuất thành công" });
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const cart = await Cart.findOne({ userId: user._id });

    res.json({
      message: "User authenticated",
      user: {
        ...user.toObject(),
        cartId: cart._id,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const googleLogin = passport.authenticate("google", {
  scope: ["openid", "profile", "email"],
});

export const googleCallback = (req, res, next) => {
  passport.authenticate("google", (err, user) => {
    if (err || !user) {
      return res.redirect(`${process.env.CLIENT_URL}/login?error=oauth_failed`);
    }

    const token = generateToken(user);

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect(`${process.env.CLIENT_URL}`);

    next();
  })(req, res, next);
};

export const verifiyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    const decoded = jwt.verify(token, process.env.EMAIL_KEY);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }
    if (user.isVerified) {
      return res.json({ message: "Email đã được xác xác thực" });
    }

    user.isVerified = true;
    await user.save();

    res.json({ message: "Email đã được xác thực thành công!" });
  } catch (error) {
    res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};

export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    if (user.isVerified) return res.json({ message: "Email đã được xác thực" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.EMAIL_KEY,
      { expiresIn: "1d" }
    );

    await sendVerificationEmail(user, token);
    res.json({ message: "Email xác thực đã được gửi lại" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};
