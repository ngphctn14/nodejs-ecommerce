import React, { useState, useEffect } from "react";
import ProductInfo from "../../components/Products/ProductInfo";
import ProductReviews from "./ProductReviews";
import Navbar from "../../components/Shared/Navbar";
import Footer from "../../components/Shared/Footer";
import axiosClient from "../../api/axiosClient";
import { useParams } from "react-router-dom";

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null); 
        
        const res = await axiosClient.get(`/products/${id}`);

        if (!res.data) { 
          throw new Error("Không tìm thấy sản phẩm!");
        }

        setProduct(res.data);
        
      } catch (err) {
        if (err.response) {
          setError(err.response.data.message || "Lỗi khi tải sản phẩm");
        } else {
          setError(err.message);
        }
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
          <div className="container mx-auto px-4">
            <ProductInfo product={product} />
            
            <ProductReviews productId={id} />
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default ProductDetailPage;