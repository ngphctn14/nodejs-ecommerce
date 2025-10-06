import OrderItem from "../models/orderItemModel.js";

export const getOrderItemsByOrderId = async (req, res) => {
  try {
    const { orderId } = req.params;
    const items = await OrderItem.find({ order_id: orderId });

    if (!items || items.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm trong đơn hàng" });
    }

    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createOrderItem = async (req, res) => {
  try {
    const item = new OrderItem(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateOrderItem = async (req, res) => {
  try {
    const item = await OrderItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: "OrderItem not found" });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteOrderItem = async (req, res) => {
  try {
    const item = await OrderItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "OrderItem not found" });
    res.json({ message: "OrderItem deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
