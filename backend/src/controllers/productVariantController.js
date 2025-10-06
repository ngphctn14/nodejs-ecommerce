import ProductVariant from "../models/productVariantModel.js";

export const getProductVariantsByProductId = async (req, res) => {
  try {
    const { productId } = req.params;
    const variants = await ProductVariant.find({ product_id: productId });
    if (!variants.length)
      return res.status(404).json({ message: "Không tìm thấy biến thể sản phẩm" });
    res.json(variants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getProductVariant = async (req, res) => {
  try {
    const variant = await ProductVariant.findById(req.params.id);

    if (!variant) {
      return res.status(404).json({ message: "Không tìm thấy biến thể sản phẩm" });
    }

    res.json(variant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProductVariant = async (req, res) => {
  try {
    const variant = new ProductVariant(req.body);
    const savedVariant = await variant.save();
    res.status(201).json(savedVariant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProductVariant = async (req, res) => {
  try {
    const variant = await ProductVariant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!variant) {
      return res.status(404).json({ message: "Không tìm thấy biến thể sản phẩm" });
    }

    res.json(variant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProductVariant = async (req, res) => {
  try {
    const variant = await ProductVariant.findByIdAndDelete(req.params.id);

    if (!variant) {
      return res.status(404).json({ message: "Không tìm thấy biến thể sản phẩm" });
    }

    res.json({ message: "Biến thể sản phẩm đã được xóa thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
