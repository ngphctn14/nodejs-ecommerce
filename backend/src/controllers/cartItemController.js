import CartItem from "../models/cartItemModel.js";

export const getCartItemsByCartId = async (req, res) => {
  try {
    const { cartId } = req.params;

    const items = await CartItem.find({ cart_id: cartId });
    if (!items || items.length === 0) {
      return res.status(404).json({ message: "Giỏ hàng trống" });
    }

    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createCartItem = async (req, res) => {
  try {
    const item = new CartItem(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const item = await CartItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: "CartItem not found" });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteCartItem = async (req, res) => {
  try {
    const item = await CartItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "CartItem not found" });
    res.json({ message: "CartItem deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
