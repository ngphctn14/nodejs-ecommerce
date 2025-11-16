import mongoose from "mongoose";

const { Schema } = mongoose;

const reviewSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    product_id: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Đánh giá phải thuộc về một sản phẩm."],
    },
    rating: {
      type: Number,
      enum: [
        null,
        1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5
      ],
      default: null,
    },
    comment: {
      type: String,
      required: [true, "Vui lòng nhập nội dung bình luận."],
      trim: true,
    },
    guest_name: {
      type: String,
      trim: true,
    }
  },
  { timestamps: true }
);

reviewSchema.pre("save", function (next) {
  const isGuest = !this.user_id;

  if (isGuest) {
    if (this.rating !== null) {
      next(new Error("Khách (guest) không được phép để lại xếp hạng (rating)."));
    } else {
      next();
    }
  } else {
    if (this.rating === null) {
      next(new Error("Người dùng đã đăng nhập phải cung cấp một xếp hạng (rating)."));
    } else {
      next();
    }
  }
});

const Review = mongoose.model("Review", reviewSchema);

export default Review;