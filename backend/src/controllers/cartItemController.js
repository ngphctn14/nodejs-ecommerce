import CartItem from "../models/cartItemModel.js";
import Cart from "../models/cartModel.js";
import ProductVariant from "../models/productVariantModel.js";
import mongoose from "mongoose";

export const getCartItemsByCartId = async (req, res) => {
  try {
    const { cartId } = req.params;

    const items = await CartItem.aggregate([
      {
        $match: {
          cart_id: new mongoose.Types.ObjectId(cartId),
        },
      },
      {
        $lookup: {
          from: "productvariants",
          localField: "product_variant_id",
          foreignField: "_id",
          as: "variant",
        },
      },
      { $unwind: "$variant" },
      {
        $lookup: {
          from: "products",
          localField: "variant.productId",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $lookup: {
          from: "productimages",
          localField: "product._id",
          foreignField: "productId",
          as: "productImages",
        },
      },
      {
        $lookup: {
          from: "productimages",
          localField: "variant._id",
          foreignField: "productVariantId",
          as: "variantImages",
        },
      },
      {
        $project: {
          _id: 1,
          quantity: 1,
          "variant._id": 1,
          "variant.price": 1,
          "variant.attributes": 1,
          "product._id": 1,
          "product.name": 1,
          "product.basePrice": 1,
          "product.discountPercent": 1,
          productImages: {
            $slice: ["$productImages.url", 1],
          },
          variantImages: {
            $slice: ["$variantImages.url", 1],
          },
        },
      },
    ]);

    res.json(items);
  } catch (err) {
    console.error("❌ Error aggregating cart items:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const createCartItem = async (req, res) => {
  try {
    const { product_variant_id, quantity } = req.body;
    
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Vui lòng đăng nhập" });
    }
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
    }

    const variant = await ProductVariant.findById(product_variant_id);
    if (!variant) {
      return res.status(404).json({ message: "Không tìm thấy biến thể sản phẩm" });
    }
    
    let existingItem = await CartItem.findOne({
      cart_id: cart._id,
      product_variant_id: product_variant_id,
    });

    let totalQuantity = quantity;
    if (existingItem) {
      totalQuantity += existingItem.quantity;
    }

    if (totalQuantity > variant.stock) {
      return res.status(400).json({ 
        message: `Vượt quá số lượng tồn kho. Chỉ còn ${variant.stock} sản phẩm.` 
      });
    }

    if (existingItem) {
      existingItem.quantity = totalQuantity;
      await existingItem.save();
      res.status(200).json(existingItem);
    } else {
      const newItem = new CartItem({
        cart_id: cart._id,
        product_variant_id,
        quantity,
      });
      await newItem.save();
      res.status(201).json(newItem);
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const item = await CartItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
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

export const increaseQuantity = async (req, res) => {
  try {
    const item = await CartItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "CartItem not found" });

    const variant = await ProductVariant.findById(item.product_variant_id);
    if (!variant) {
      return res.status(404).json({ message: "Product variant not found" });
    }

    if (item.quantity + 1 > variant.stock) {
      return res.status(400).json({
        message: `Không thể tăng số lượng. Hiện chỉ còn ${variant.stock} sản phẩm trong kho.`,
      });
    }

    item.quantity += 1;
    await item.save();

    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const decreaseQuantity = async (req, res) => {
  try {
    const item = await CartItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "CartItem not found" });

    if (item.quantity <= 1) {
      return;
    }

    item.quantity -= 1;
    await item.save();

    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
