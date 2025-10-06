import mongoose from "mongoose";

const { Schema } = mongoose;

const cartSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema); 

export default Cart