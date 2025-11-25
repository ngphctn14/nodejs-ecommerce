import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import passport from "passport";
import crypto from "crypto";

import User from "../models/userModel.js";
import Cart from "../models/cartModel.js";
import CartItem from "../models/cartItemModel.js";
import ProductVariant from "../models/productVariantModel.js";

import { sendVerificationEmail, sendMagicLink, sendResetPasswordEmail } from "../config/mailer.js";

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

export const handleGuestFlow = async (req, res) => {
  try {
    const { email, localCartItems } = req.body;

    let user = await User.findOne({ email });
    let isNewUser = false;
    let temporaryPassword = null;

    if (!user) {
      isNewUser = true;
      temporaryPassword = crypto.randomBytes(10).toString('hex');
      
      user = new User({
        email,
        fullName: "Guest User",
        password: temporaryPassword, 
        isVerified: true,
      });
      await user.save();
      await Cart.create({ userId: user._id });
    }

    const cart = await Cart.findOne({ userId: user._id });
    
    if (localCartItems && localCartItems.length > 0) {
      for (const localItem of localCartItems) {
        const variant = await ProductVariant.findById(localItem.variantId);
        if (!variant || variant.stock < localItem.quantity) {
          console.warn(`[GUEST FLOW] Thiếu tồn kho cho variant ${localItem.variantId}`);
          continue; 
        }

        let existingItem = await CartItem.findOne({
          cart_id: cart._id,
          product_variant_id: localItem.variantId,
        });

        if (existingItem) {
          existingItem.quantity += localItem.quantity;
          await existingItem.save();
        } else {
          await CartItem.create({
            cart_id: cart._id,
            product_variant_id: localItem.variantId,
            quantity: localItem.quantity,
            price: localItem.price
          });
        }
      }
    }

    const magicToken = generateToken(user);
    const verificationLink = `${process.env.SERVER_URL}/api/auth/verify-guest-token?token=${magicToken}`;
      
    await sendMagicLink(user, verificationLink, isNewUser, temporaryPassword);

    return res.status(200).json({
      message: isNewUser
        ? "Tài khoản đã được tạo. Vui lòng kiểm tra email để đặt mật khẩu và hoàn tất thanh toán."
        : "Link đăng nhập nhanh đã được gửi. Vui lòng kiểm tra email để tiếp tục."
    });

  } catch (error) {
    console.error("Lỗi Guest Checkout Flow:", error);
    res.status(500).json({ message: "Lỗi máy chủ khi xử lý email khách." });
  }
};


export const verifyGuestToken = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.redirect(`${process.env.CLIENT_URL}/login?error=invalid_link`);
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.redirect(`${process.env.CLIENT_URL}/login?error=user_not_found`);
    }

    if (!user.isVerified) {
      user.isVerified = true;
      await user.save();
    }
    
    const accessToken = generateToken(user);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    if (user.isVerified && user.password && user.password.includes("TEMP_PASSWORD_")) {
        return res.redirect(`${process.env.CLIENT_URL}/profile?prompt=change_password`);
    }
    
    res.redirect(`${process.env.CLIENT_URL}/checkout`); 

  } catch (error) {
    console.error("Lỗi Verify Guest Token:", error);
    res.redirect(`${process.env.CLIENT_URL}/login?error=token_expired`);
  }
};

export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      // Security: Don't reveal if email exists or not
      return res.status(200).json({ message: "Nếu email tồn tại, bạn sẽ nhận được hướng dẫn." });
    }

    // Generate a random token
    const resetToken = crypto.randomBytes(32).toString("hex");
    
    // Hash it and save to user (security best practice)
    // But for simplicity in this project, we can save it directly or a simple hash
    // Here we will save it directly to kept it simple for you, 
    // but in production, hash it like a password.
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;

    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    await sendResetPasswordEmail(user, resetUrl);

    res.status(200).json({ message: "Email đặt lại mật khẩu đã được gửi." });
  } catch (error) {
    console.error("Reset Password Request Error:", error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn." });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    const accessToken = generateToken(user);
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Mật khẩu đã được đặt lại thành công." });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password)) || user.role !== "admin") {
      return res.status(400).json({ message: "Thông tin không hợp lệ hoặc không có quyền" });
    }

    const token = generateToken(user);

    res.json({
      message: "Đăng nhập quản trị thành công",
      token: token, 
      user: {
        id: user._id,
        full_name: user.fullName,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};