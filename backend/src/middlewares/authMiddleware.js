import jwt from "jsonwebtoken";
import Cart from "../models/cartModel.js";

export const authenticateUser = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const cart = await Cart.findOne({ userId: decoded.id });
    decoded.cartId = `${cart._id}`;
    req.user = decoded;

    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const authenticateUserOptional = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    
    const cart = await Cart.findOne({ userId: decoded.id });
    if (cart) {
        decoded.cartId = `${cart._id}`;
    }

    req.user = decoded;
    
    next();
  } catch (err) {
    req.user = null;
    next();
  }
};

export const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: Admins only" });
  }
  next();
};

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization; 
  
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Chưa đăng nhập (Thiếu Token)" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token không hợp lệ hoặc hết hạn" });
  }
};