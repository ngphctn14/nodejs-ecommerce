import React from "react";
import Navbar from "../../../components/Shared/Navbar";
import Footer from "../../../components/Shared/Footer";
import ProductList from "../../../components/Products/ProductsList"; 
import ProductsIntroduction from "../../../components/Products/ProductsIntroduction";
import image from '/giaybongda.jpg';
import productImage from '/typeImage/fg.jpg'


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
Giày đá bóng sân cỏ tự nhiên (SG, FG) thiết kế đinh dài giúp bám sân chắc chắn, tăng tốc và xoay trở tốt trên mặt sân cỏ thật. Phù hợp cho cầu thủ chơi ở sân 11 người, sân tiêu chuẩn.

Tại Thanh Hùng Futsal, bạn có thể chọn các dòng giày đá banh FG, SG chính hãng từ Nike, Adidas, Mizuno, Puma… với công nghệ đinh tiên tiến, upper cao cấp và form ôm chân chuẩn thi đấu.
`;
const FGType = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-20 max-w-7xl mx-auto px-4">
        <ProductsIntroduction name="Giày bóng đá cỏ tự nhiên" description={description} image={productImage} />
        <ProductList products={sampleProducts} />
      </div>
      <Footer />
    </div>
  );
};

export default FGType;