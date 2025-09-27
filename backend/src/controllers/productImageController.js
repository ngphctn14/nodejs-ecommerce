import ProductImage from "../models/productImageModel.js";

export const getProductImages = async (req, res) => {
  try {
    const images = await ProductImage.find();
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductImage = async (req, res) => {
  try {
    const image = await ProductImage.findById(req.params.id);

    if (!image) {
      return res.status(404).json({ message: "Không tìm thấy ảnh sản phẩm" });
    }

    res.json(image);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProductImage = async (req, res) => {
  try {
    const image = new ProductImage(req.body);
    const savedImage = await image.save();
    res.status(201).json(savedImage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProductImage = async (req, res) => {
  try {
    const image = await ProductImage.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!image) {
      return res.status(404).json({ message: "Không tìm thấy ảnh sản phẩm" });
    }

    res.json(image);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProductImage = async (req, res) => {
  try {
    const image = await ProductImage.findByIdAndDelete(req.params.id);

    if (!image) {
      return res.status(404).json({ message: "Không tìm thấy ảnh sản phẩm" });
    }

    res.json({ message: "Ảnh sản phẩm đã được xóa thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
