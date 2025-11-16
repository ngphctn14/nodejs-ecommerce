import React, { useState, useContext } from "react"; // 👈 Thêm useContext
import { ShoppingCart, Check, Loader2 } from "lucide-react"; // 👈 Thêm Loader2
import { AuthContext } from "../../context/AuthContext"; // 👈 Thêm AuthContext
import axiosClient from "../../api/axiosClient"; // 👈 Thêm axiosClient

const ProductInfo = ({ product }) => {
  const {
    _id,
    name,
    brand,
    description,
    basePrice,
    oldPrice,
    discountPercent,
    images = [],
    variants = [],
  } = product;

  const [selectedImage, setSelectedImage] = useState(
    images[0] || "/giaybongda.jpg"
  );
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [addedToCart, setAddedToCart] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const { user } = useContext(AuthContext);

  const availableSizes = [...new Set(variants.map((v) => v.size))];

  const availableColors = selectedSize
    ? variants
        .filter((v) => v.size === selectedSize)
        .map((v) => ({ color: v.color, stock: v.stock }))
    : [];

  const selectedVariant = variants.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  );
  const inStock = selectedVariant ? selectedVariant.stock > 0 : false;

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) {
      alert("Vui lòng chọn kích thước và màu sắc!");
      return;
    }
    if (!selectedVariant) {
      alert("Lỗi: Không tìm thấy biến thể sản phẩm.");
      return;
    }
    if (!inStock) {
      alert("Sản phẩm này hiện đã hết hàng!");
      return;
    }

    setIsAdding(true);
    try {
      if (user) {
        await axiosClient.post("/cart-items", {
          product_variant_id: selectedVariant._id,
          quantity: 1,
        });
      } else {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];

        const existingItemIndex = cart.findIndex(
          (item) => item.variantId === selectedVariant._id
        );

        if (existingItemIndex > -1) {
          cart[existingItemIndex].quantity += 1;
        } else {
          const newItem = {
            variantId: selectedVariant._id,
            name: name,
            size: selectedVariant.size,
            color: selectedVariant.color,
            price: selectedVariant.price,
            quantity: 1,
            image: images[0] || "/giaybongda.jpg",
          };
          cart.push(newItem);
        }
        localStorage.setItem("cart", JSON.stringify(cart));
      }

      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (err) {
      console.error("Lỗi khi thêm vào giỏ hàng:", err);
      alert(
        "Lỗi: " +
          (err.response?.data?.message ||
            err.message ||
            "Không thể thêm vào giỏ hàng.")
      );
    } finally {
      setIsAdding(false);
    }
  };

  const formatPrice = (price) => price.toLocaleString("vi-VN") + " ₫";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-xl border">
            <img
              src={selectedImage}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>

          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all
                    ${
                      selectedImage === img
                        ? "border-blue-500"
                        : "border-gray-200"
                    }
                  `}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
            <p className="text-lg text-gray-600 mt-1">Hãng: {brand}</p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-red-600">
              {formatPrice(basePrice)}
            </span>
            {oldPrice && oldPrice > basePrice && (
              <>
                <span className="text-xl text-gray-500 line-through">
                  {formatPrice(oldPrice)}
                </span>
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  -{discountPercent}%
                </span>
              </>
            )}
          </div>

          {/* Mô tả */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Mô tả sản phẩm</h3>
            <p className="text-gray-600 leading-relaxed">{description}</p>
          </div>

          {/* Chọn Size */}
          <div>
            <h3 className="font-semibold mb-3">Kích thước</h3>
            <div className="flex gap-3 flex-wrap">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    setSelectedSize(size);
                    setSelectedColor(""); // Reset màu khi đổi size
                  }}
                  className={`w-16 h-12 rounded-lg border-2 font-medium transition-all
                    ${
                      selectedSize === size
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-300 hover:border-gray-400"
                    }
                  `}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Chọn Màu */}
          {selectedSize && (
            <div>
              <h3 className="font-semibold mb-3">
                Màu sắc{" "}
                <span className="text-sm text-gray-500">
                  (Size {selectedSize})
                </span>
              </h3>
              <div className="flex gap-3 flex-wrap">
                {availableColors.map(({ color, stock }) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    disabled={stock === 0}
                    className={`px-5 py-3 rounded-lg border-2 font-medium transition-all flex items-center gap-2
                      ${
                        selectedColor === color
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : stock === 0
                          ? "border-gray-200 text-gray-400 cursor-not-allowed"
                          : "border-gray-300 hover:border-gray-400"
                      }
                    `}
                  >
                    {color}
                    {stock === 0 && <span className="text-xs">(Hết)</span>}
                    {selectedColor === color && <Check size={16} />}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={!inStock || addedToCart || isAdding}
            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all
              ${
                addedToCart
                  ? "bg-green-500 text-white"
                  : isAdding
                  ? "bg-blue-400 text-white cursor-wait"
                  : inStock
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }
            `}
          >
            {addedToCart ? (
              <>
                <Check size={24} />
                Đã thêm vào giỏ hàng!
              </>
            ) : isAdding ? (
              <>
                <Loader2 size={24} className="animate-spin" />
                Đang thêm...
              </>
            ) : (
              <>
                <ShoppingCart size={24} />
                Thêm vào giỏ hàng
              </>
            )}
          </button>

          {/* Thông báo trạng thái */}
          {!inStock && selectedSize && selectedColor && (
            <p className="text-red-500 text-center font-medium">
              Sản phẩm size {selectedSize} màu {selectedColor} đã hết hàng!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
