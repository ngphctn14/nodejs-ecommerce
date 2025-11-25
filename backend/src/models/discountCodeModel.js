  import mongoose from "mongoose";

  const { Schema } = mongoose;

  const discountCodeSchema = new Schema(
    {
      code: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        uppercase: true,
      },
      discount_value: {
        type: Number,
        required: true,
        min: 0,
      },
      max_usage: {
        type: Number,
        required: true,
        min: 1,
      },
      times_used: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    { timestamps: true }
  );

  const DiscountCode = mongoose.model("DiscountCode", discountCodeSchema);

  export default DiscountCode;
