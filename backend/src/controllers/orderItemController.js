import OrderItem from "../models/orderItemModel.js";
import ProductImage from "../models/productImageModel.js";

export const getOrderItemsByOrderId = async (req, res) => {
  try {
    const { orderId } = req.params;

    const items = await OrderItem.find({ order_id: orderId }).populate({
      path: "product_variant_id",
      model: "ProductVariant",
      populate: {
        path: "productId",
        model: "Product",
        select: "name",
      },
    });

    if (!items || items.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy sản phẩm trong đơn hàng" });
    }

    const itemsWithImages = await Promise.all(
      items.map(async (item) => {
        const variantId = item.product_variant_id?._id;
        const productId = item.product_variant_id?.productId?._id;
        const productName = item.product_variant_id?.productId?.name || "Sản phẩm không xác định";

        let image = await ProductImage.findOne({ productVariantId: variantId });
        if (!image && productId) {
          image = await ProductImage.findOne({ productId });
        }

        return {
          ...item.toObject(),
          productId: productId, 
          name: productName,   
          image: image ? image.url : null,
        };
      })
    );

    res.json(itemsWithImages);
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
    const item = await OrderItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
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
