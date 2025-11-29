import React, { useEffect, useState } from "react";
import Navbar from "../../components/Shared/Navbar";
import Footer from "../../components/Shared/Footer";
import ProductList from "../../components/Products/ProductsList"; 
import ProductsIntroduction from "../../components/Products/ProductsIntroduction";
import productImage from '/allProducts.jpeg';
import axiosClient from "../../api/axiosClient";
import { Helmet } from "react-helmet";

const description = `Chọn mẫu giày đá bóng thích hợp sẽ giúp bạn tư tin hơn khi ra sân. Để biết mẫu giày nào phù hợp với bạn, hãy tham khảo các yếu tố sau: Đế giày (sân cỏ tự nhiên, sân cỏ nhân tạo, futsal), form giày (thon hoặc bè), ngân sách cá nhân. Một đôi giày phù hợp sẽ giúp bạn tăng tốc nhanh, tăng độ bám sân và giảm thiểu rủi ro chấn thương.

Đế thời đurc "chân ái" thuc sư, có 3 yếu tố bạn nên cân nhăc: mức săn thị đâù (futsal hay sân cỏ nhân tạo), form chân (thon hay bè) và ngân sách cá nhân. Mốt đôi giày phù hợp sẽ giúp bạn xị lòng linh hoat, tăng độ bền sân và hạn chế toi da rui ro chấn thurong.

Tai Thanh Hung Futsal - chỗi cưa hàng giày đa bản chinh hãng uy tín tai TPHCM, ban sẽ tìm thấy các mẫu mới nhất của Nike Mad Energy Pack, adidas Celestial Victory Pack, Vapor 16 Pro, cùng những mẫu hot khác từ Nike, adidas, PUMA, Mizuno, Joma, Asics... voi đủ size, màu sắc và mức giá đa dạng để bạn dễ dàng chọn đôi ưng y.

Tặng kèm 1 đôi vớ + 1 ballo THF cho mọi đơn hàng giày đầu tiên - Ho tro gap 0% lãi suất qua Fundin - Bảo hành mền phỉ 6 tháng.`;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosClient.get("/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{`Tất cả sản phẩm`}</title>
      </Helmet>
      <Navbar />
      <div className="pt-20 max-w-7xl mx-auto px-4">
        <ProductsIntroduction
          name="TẤT CẢ SẢN PHẨM"
          description={description}
          image={productImage}
        />
        {loading ? (
          <p className="text-center py-10">Đang tải sản phẩm...</p>
        ) : (
          <ProductList products={products} />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Products;
