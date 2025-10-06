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
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipping", "delivered"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;