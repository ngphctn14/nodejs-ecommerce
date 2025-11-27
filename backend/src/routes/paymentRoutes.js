import {
  VNPay,
  IpnFailChecksum,
  IpnOrderNotFound,
  IpnInvalidAmount,
  InpOrderAlreadyConfirmed,
  IpnUnknownError,
  IpnSuccess,
} from "vnpay";
import express from "express";
import dotenv from "dotenv";
import Order from "../models/orderModel.js";
import Cart from "../models/cartModel.js";
import User from "../models/userModel.js";
import CartItem from "../models/cartItemModel.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

import { sendOrderSuccessEmail } from "../config/mailer.js";

dotenv.config();

const router = express.Router();

const vnpay = new VNPay({
  tmnCode: process.env.VNPAY_TMN_CODE,
  secureSecret: process.env.VNPAY_HASH_SECRET,
  vnpayHost: "https://sandbox.vnpayment.vn",
  testMode: true,
  hashAlgorithm: "SHA512",
  enableLog: true,
});

router.post("/pay/:orderId", authenticateUser, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng." });
    }

    if (!order.user_id.equals(req.user.id)) {
      return res
        .status(401)
        .json({ message: "Không có quyền truy cập đơn hàng này." });
    }

    if (order.status !== "pending") {
      return res.status(400).json({ message: "Đơn hàng này đã được xử lý." });
    }

    let ipAddr = req.ip;

    if (ipAddr === "::1" || ipAddr === "127.0.0.1") {
      ipAddr = "13.160.92.202";
    }

    const paymentUrl = vnpay.buildPaymentUrl({
      vnp_Amount: order.total_price,
      vnp_IpAddr: ipAddr,
      vnp_TxnRef: `${order._id}`,
      vnp_OrderInfo: `Thanh toan don hang ${order._id}`,
      vnp_OrderType: "other",
      vnp_ReturnUrl: process.env.VNPAY_RETURN_URL,
    });

    res.json({ paymentUrl });
  } catch (err) {
    console.error("Lỗi khi tạo URL VNPAY:", err);
    res.status(500).json({ message: "Lỗi máy chủ khi tạo URL thanh toán." });
  }
});

router.get("/vnpay-return", (req, res) => {
  let verify;
  try {
    verify = vnpay.verifyReturnUrl(req.query);
    if (!verify.isVerified) {
      return res.redirect(`${process.env.CLIENT_URL}/payment-failed`);
    }
    if (!verify.isSuccess) {
      return res.redirect(`${process.env.CLIENT_URL}/payment-failed`);
    }
  } catch (error) {
    return res.send("Dữ liệu không hợp lệ");
  }
  return res.redirect(
    `${process.env.CLIENT_URL}/order-success/${verify.vnp_TxnRef}`
  );
});

router.get("/vnpay-ipn", async (req, res) => {
  try {
    const verify = vnpay.verifyReturnUrl(req.query);
    console.log(verify);

    if (!verify.isVerified) {
      return res.json(IpnFailChecksum);
    }

    if (!verify.isSuccess) {
      return res.json(IpnUnknownError);
    }

    const order = await Order.findById(verify.vnp_TxnRef);

    if (!order) {
      return res.json(IpnOrderNotFound);
    }

    if (verify.vnp_Amount !== order.total_price) {
      return res.json(IpnInvalidAmount);
    }

    if (order.status === "confirmed") {
      return res.json(InpOrderAlreadyConfirmed);
    }

    try {
      const cart = await Cart.findOne({ userId: order.user_id });
      if (cart) {
        await CartItem.deleteMany({ cart_id: cart._id });
        console.log(`IPN: Đã xóa giỏ hàng cho user ${order.user_id}.`);
      }
    } catch (cartError) {
      console.error("IPN: Lỗi khi xóa giỏ hàng:", cartError);
    }

    await order.updateStatus("confirmed");
    const user = await User.findById(order.user_id);

    await sendOrderSuccessEmail(user, order);

    return res.json(IpnSuccess);
  } catch (error) {
    console.log(`verify error: ${error}`);
    return res.json(IpnUnknownError);
  }
});

export default router;
