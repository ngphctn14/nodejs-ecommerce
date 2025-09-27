import React from "react";
import Navbar from "../../../components/Shared/Navbar";
import Footer from "../../../components/Shared/Footer";
import ProductList from "../../../components/Products/ProductsList"; 
import ProductsIntroduction from "../../../components/Products/ProductsIntroduction";
import image from '/giaybongda.jpg';
import productImage from '/brandImage/nike.jpg'


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

const description = `Là biểu tượng đích thực trên thị trường giày đá bóng, Nike luôn tiên phong trong công nghệ và thiết kế để mang đến hiệu suất vượt trội cho người chơi ở mọi cấp độ – đặc biệt là người đá phủi trên mặt sân cỏ nhân tạo. Với thiết kế đế TF bám sân tốt, ôm chân chuẩn form và chất liệu cao cấp, giày đá bóng Nike chính hãng là lựa chọn hàng đầu cho những ai đề cao cả hiệu năng lẫn phong cách thi đấu.

Tại Thanh Hùng Futsal – địa chỉ chuyên giày đá bóng Nike chính hãng tại TP. HCM, khách hàng có thể tìm thấy đầy đủ các dòng Nike mới nhất cho sân cỏ nhân tạo:

Nike Mercurial: silo 'Speed' với upper ôm chân, giúp rê bóng và bứt tốc tối đa.

Nike Tiempo: silo 'Touch' với lớp da nhân tạo (Legend 10) hoặc da bê (Legend 9) êm ái.

Nike Phantom: silo 'Control' dành cho cầu thủ ưa chuộng chuyền – sút chính xác.

Nike Premier: thiết kế cổ điển, da thật Kangaroo cho cảm giác bóng tự nhiên, đẳng cấp.`;

const NikeBrand = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-20 max-w-7xl mx-auto px-4">
        <ProductsIntroduction name="Giày bóng đá nike" description={description} image={productImage} />
        <ProductList products={sampleProducts} />
      </div>
      <Footer />
    </div>
  );
};

export default NikeBrand;