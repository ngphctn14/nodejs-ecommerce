import React, { useState, useEffect } from "react";
import ProductInfo from "../../components/Products/ProductInfo";
import Navbar from "../../components/Shared/Navbar";
import Footer from "../../components/Shared/Footer";
import { useParams } from "react-router-dom";

const sampleProducts = {
  "690cc987bdd1f70773135e6a": {
    _id: "690cc987bdd1f70773135e6a",
    name: "Giày Thể Thao Nam Biti's Hunter X DSMH09800DEN (Đen) - Phiên Bản 10.11 Sale",
    brand: "Biti's Hunter",
    description: `
      • Phiên bản đặc biệt 10.11 - Màu Đen huyền thoại kết hợp đế LITETRACK siêu nhẹ
      • Chất liệu vải dệt kim cao cấp, thoáng khí, chống thấm nước nhẹ
      • Công nghệ đế #LITEFLEX 2.0 - giảm 30% trọng lượng, tăng độ đàn hồi gấp đôi
      • Form giày chuẩn chân Việt Nam, ôm chân, không tuột gót
      • Đệm lót êm ái, kháng khuẩn 99% với công nghệ Ag+ Silver
      • Phù hợp: đi học, đi làm, chạy bộ nhẹ, dạo phố
      • Bảo hành chính hãng 12 tháng, đổi size miễn phí trong 30 ngày
    `.trim(),

    basePrice: 679000,
    oldPrice: 1090000,
    discountPercent: 38,

    images: [
      "https://product.hstatic.net/1000230642/product/hsm004800xmn__4__4d9f5f8609704aa282be461097192798.jpg",
      "https://product.hstatic.net/1000230642/product/hsm004800xmn__10__219fce0c6ac8473cbbf0737259a2a728.jpg",
      "https://product.hstatic.net/1000230642/product/hsm004800xmn__9__3dd149261f40485db9a8c4c470bd76f8.jpg",
      "https://product.hstatic.net/1000230642/product/hsm004800xmn__3__664040c27c0d4120837d0f7d3e66d4fa.jpg",
      "https://product.hstatic.net/1000230642/product/hsm004800xmn__7__18e3a9a5b52943208971f32ac716dc08.jpg"
    ],

    variants: [
      { size: "39", color: "Đen", stock: 12 },
      { size: "39", color: "Trắng", stock: 0 },
      { size: "39", color: "Xám", stock: 5 },
      { size: "40", color: "Đen", stock: 8 },
      { size: "40", color: "Trắng", stock: 15 },
      { size: "40", color: "Xanh Navy", stock: 3 },
      { size: "41", color: "Đen", stock: 0 },
      { size: "41", color: "Trắng", stock: 7 },
      { size: "41", color: "Xám", stock: 2 },
      { size: "41", color: "Đỏ", stock: 4 },
      { size: "42", color: "Đen", stock: 20 },
      { size: "42", color: "Trắng", stock: 18 },
      { size: "42", color: "Xanh Navy", stock: 0 },
      { size: "43", color: "Đen", stock: 9 },
      { size: "43", color: "Trắng", stock: 0 },
    ]
  },
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));

        const foundProduct = sampleProducts[id];
        if (!foundProduct) {
          throw new Error("Không tìm thấy sản phẩm!");
        }

        setProduct(foundProduct);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      {/* Navbar cố định */}
      <Navbar />

      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <nav className="text-sm">
              <ul className="flex gap-2 text-gray-600 flex-wrap">
                <li><a href="/" className="hover:text-blue-600">Trang chủ</a></li>
                <li><span>/</span></li>
                <li><a href="/products" className="hover:text-blue-600">Sản phẩm</a></li>
                <li><span>/</span></li>
                <li className="text-gray-900 font-medium truncate max-w-md">
                  {product?.name || "Đang tải..."}
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-4">
                <div className="aspect-square bg-gray-200 rounded-xl animate-pulse" />
                <div className="grid grid-cols-4 gap-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-10 bg-gray-200 rounded animate-pulse w-3/4" />
                <div className="h-6 bg-gray-200 rounded w-32 animate-pulse" />
                <div className="h-12 bg-gray-200 rounded animate-pulse" />
                <div className="space-y-3">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="container mx-auto px-4 py-20 text-center">
            <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-red-600 mb-4">Oops!</h2>
              <p className="text-red-700 mb-6">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Thử lại
              </button>
            </div>
          </div>
        )}

        {!loading && !error && product && (
          <ProductInfo product={product} />
        )}
      </div>

      <Footer />
    </>
  );
};

export default ProductDetailPage;