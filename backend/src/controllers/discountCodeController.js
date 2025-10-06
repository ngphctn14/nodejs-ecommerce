import DiscountCode from "../models/DiscountCode.js";

export const getDiscountCodes = async (req, res) => {
  try {
    const codes = await DiscountCode.find();
    res.json(codes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getDiscountCode = async (req, res) => {
  try {
    const code = await DiscountCode.findById(req.params.id);
    if (!code) return res.status(404).json({ message: "Không tìm thấy mã giảm giá" });
    res.json(code);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createDiscountCode = async (req, res) => {
  try {
    const code = new DiscountCode(req.body);
    await code.save();
    res.status(201).json(code);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateDiscountCode = async (req, res) => {
  try {
    const code = await DiscountCode.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!code) return res.status(404).json({ message: "Không tìm thấy mã giảm giá" });
    res.json(code);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteDiscountCode = async (req, res) => {
  try {
    const code = await DiscountCode.findByIdAndDelete(req.params.id);
    if (!code) return res.status(404).json({ message: "Không tìm thấy mã giảm giá" });
    res.json({ message: "Mã giảm giá được xóa thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
