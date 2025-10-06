import Cart from "../models/cartModel.js";

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id);
    if (!cart) return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createCart = async (req, res) => {
  try {
    const cart = new Cart(req.body);
    await cart.save();
    res.status(201).json(cart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateCart = async (req, res) => {
  try {
    const cart = await Cart.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!cart) return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
    res.json(cart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteCart = async (req, res) => {
  try {
    const cart = await Cart.findByIdAndDelete(req.params.id);
    if (!cart) return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
    res.json({ message: "Giỏ hàng được xóa thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
