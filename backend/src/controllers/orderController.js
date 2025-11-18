import Order from "../models/orderModel.js";
import { sendOrderSuccessEmail } from "../config/mailer.js";
import User from "../models/userModel.js";

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getOrdersByUserId = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Không được phép" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ user_id: req.user.id })
      .populate("address_id")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalOrders = await Order.countDocuments({ user_id: req.user.id });
    const totalPages = Math.ceil(totalOrders / limit);

    if (!orders) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }


    res.json({
      orders,
      currentPage: page,
      totalPages,
      totalOrders,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    const order = new Order(req.body);

    const user = await User.findById(order.user_id);

    await sendOrderSuccessEmail(user, order);

    await order.save();
    res.status(201).json(order);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ error: err.message });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    res.json({ message: "Đơn hàng được xóa thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
