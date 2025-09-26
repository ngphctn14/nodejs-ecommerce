import React from "react";
import Navbar from "../../../components/Shared/Navbar";
import Footer from "../../../components/Shared/Footer";
import ProductList from "../../../components/Products/ProductsList"; 
import ProductsIntroduction from "../../../components/Products/ProductsIntroduction";
import image from '/giaybongda.jpg';
import productImage from '/typeImage/tf.jpg'


const sampleProducts = Array.from({ length: 50 }, (_, index) => {
  const id = index + 1;
  const price = Math.floor(Math.random() * (1000000 - 50000 + 1)) + 50000; 
  const salePercent = Math.random() > 0.5 ? Math.floor(Math.random() * 30) + 5 : 0;
  const oldPrice = salePercent > 0 ? Math.floor(price / (1 - salePercent / 100)) : price; 
  const sales = Math.floor(Math.random() * 200);
  const createdAt = new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(); 

  return {
    id,
    name: `Sản phẩm ${id}`,
    price,
    oldPrice,
    salePercent,
    imageUrl: image,
    createdAt,
    sales,
  };
});

const description = `
Giày đá bóng sân cỏ nhân tạo (TF) chính hãng là lựa chọn tối ưu cho các trận cầu 5–7 người, giúp người chơi phong trào yên tâm bứt tốc, đổi hướng và xử lý bóng linh hoạt trên mặt sân có độ ma sát cao. Với thiết kế đế TF chuyên dụng và phần upper ôm chân, giày TF giúp tăng độ bám sân, kiểm soát bóng chính xác và hạn chế trơn trượt trong mọi điều kiện thi đấu.

Tại Thanh Hùng Futsal – địa chỉ chuyên giày bóng đá chính hãng tại TP. HCM, khách hàng có thể dễ dàng trải nghiệm và lựa chọn các mẫu giày đá bóng sân cỏ nhân tạo mới nhất 2025 từ những thương hiệu hàng đầu như Nike, adidas, Mizuno, Joma, Asics, Desporte, Kamito… với đầy đủ size, màu sắc và phân khúc giá phù hợp mọi nhu cầu.
`;
const TFType = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-20 max-w-7xl mx-auto px-4">
        <ProductsIntroduction name="Giày bóng đá cỏ nhân tạo" description={description} image={productImage} />
        <ProductList products={sampleProducts} />
      </div>
      <Footer />
    </div>
  );
};

export default TFType;