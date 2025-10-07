import React from "react";
import Navbar from "../../../components/Shared/Navbar";
import Footer from "../../../components/Shared/Footer";
import ProductList from "../../../components/Products/ProductsList"; 
import ProductsIntroduction from "../../../components/Products/ProductsIntroduction";
import image from '/giaybongda.jpg';
import productImage from '/brandImage/puma.jpg'


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

const description = `Là biểu tượng đích thực trên thị trường giày đá bóng, PUMA luôn tiên phong trong thiết kế táo bạo và công nghệ tiên tiến để mang đến hiệu suất vượt trội cho người chơi ở mọi cấp độ – đặc biệt là người đá phủi trên mặt sân cỏ nhân tạo. Với thiết kế đế TF bám sân tốt, ôm chân chuẩn form và chất liệu cao cấp, giày đá bóng Puma chính hãng là lựa chọn hàng đầu cho những ai đề cao cả hiệu năng lẫn phong cách thi đấu.

Tại Thanh Hùng Futsal – địa chỉ chuyên giày đá bóng Puma chính hãng tại TP.HCM, khách hàng có thể tìm thấy đầy đủ các dòng Puma mới nhất cho sân cỏ nhân tạo:

PUMA Future: silo 'Control' tập trung vào khả năng kiểm soát bóng, sự thoải mái và linh hoạt của người mang.

PUMA Ultra: silo 'Speed' hỗ trợ khả năng bứt tốc và rê dắt của người mang.

PUMA King: silo lâu đời, tập trung vào cảm giác bóng chân thật và sự thoải mái tối đa.`;

const PumaBrand = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-20 max-w-7xl mx-auto px-4">
        <ProductsIntroduction name="Giày bóng đá puma" description={description} image={productImage}/>
        <ProductList products={sampleProducts} isBrand = {true}/>
      </div>
      <Footer />
    </div>
  );
};

export default PumaBrand;