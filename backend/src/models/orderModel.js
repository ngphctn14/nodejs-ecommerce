import User from "./userModel.js";
import ProductVariant from "./productVariantModel.js";
import OrderItem from "./orderItemModel.js";

import mongoose from "mongoose";

const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    address_id: {
      type: Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    discount_code_id: {
      type: Schema.Types.ObjectId,
      ref: "DiscountCode",
      default: null,
    },
    total_price: {
      type: Number,
      required: true,
    },
    loyalty_points_used: {
      type: Number,
      default: 0,
    },
    loyalty_points_earned: {
      type: Number,
      default: 0,
    },
    payment_method: {
      type: String,
      enum: ["cash", "vnpay"],
    },
    payment_status: {
      type: String,
      enum: ["unpaid", "paid", "refunded"],
      default: "unpaid",
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipping", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

orderSchema.methods.updateStatus = async function (newStatus) {
  const oldStatus = this.status;

  if (oldStatus === newStatus) return;

  const orderItems = await OrderItem.find({ order_id: this._id });

  if (oldStatus === "pending" && newStatus === "confirmed") {
    // 1. Deduct Stock
    for (const item of orderItems) {
      const variant = await ProductVariant.findById(item.product_variant_id);
      if (!variant) continue;

      if (variant.stock < item.quantity) {
        throw new Error(`Sản phẩm ${variant.sku} không đủ hàng tồn kho.`);
      }
      variant.stock -= item.quantity;
      await variant.save();
    }

    // 2. Add Earned Points
    if (this.loyalty_points_earned > 0) {
      await User.findByIdAndUpdate(this.user_id, {
        $inc: { loyaltyPoints: this.loyalty_points_earned },
      });
    }

    if (this.loyalty_points_used > 0) {
      await User.findByIdAndUpdate(this.user_id, {
        $inc: { loyaltyPoints: -this.loyalty_points_used },
      });
    }
  }

  // --- CASE B: Cancelling Order (Any -> Cancelled) ---
  if (newStatus === "cancelled" && oldStatus !== "cancelled") {
    // 1. Restock (Only if previously deducted)
    if (["confirmed", "shipping", "delivered"].includes(oldStatus)) {
      for (const item of orderItems) {
        await ProductVariant.findByIdAndUpdate(item.product_variant_id, {
          $inc: { stock: item.quantity },
        });
      }

      // 2. Remove Earned Points
      if (this.loyalty_points_earned > 0) {
        await User.findByIdAndUpdate(this.user_id, {
          $inc: { loyaltyPoints: -this.loyalty_points_earned },
        });
      }
    }

    // 3. Refund Used Points (Always do this)
    if (this.loyalty_points_used > 0) {
      await User.findByIdAndUpdate(this.user_id, {
        $inc: { loyaltyPoints: this.loyalty_points_used },
      });
    }
  }

  // Update status
  this.status = newStatus;
  // If confirmed, also mark paid (optional, depends on your flow)
  if (newStatus === "confirmed" && this.payment_method === "vnpay") {
    this.payment_status = "paid";
  }

  return this.save();
};

const Order = mongoose.model("Order", orderSchema);

export default Order;
