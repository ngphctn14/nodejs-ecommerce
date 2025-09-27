import mongoose from "mongoose";

const productImageSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    productVariantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductVariant",
    },
    url: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
    },
  },
  { timestamps: true }
);

productImageSchema.pre("save", function (next) {
  if (!this.productId && !this.productVariantId) {
    return next(new Error("Ảnh phải thuộc về một sản phẩm hoặc một biến thể sản phẩm"));
  }
  next();
});

const ProductImage = mongoose.model("ProductImage", productImageSchema);
export default ProductImage;
