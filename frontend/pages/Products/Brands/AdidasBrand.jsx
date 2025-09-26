import React from "react";
import Navbar from "../../../components/Shared/Navbar";
import Footer from "../../../components/Shared/Footer";
import ProductList from "../../../components/Products/ProductsList"; 
import ProductsIntroduction from "../../../components/Products/ProductsIntroduction";
import image from '/giaybongda.jpg';
import productImage from '/brandImage/adidas.jpg'

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

const description = `Nhắc đến giày đá bóng, không thể không nhắc đến adidas – thương hiệu gắn liền với những huyền thoại sân cỏ như Lionel Messi. Không chỉ nổi bật về danh tiếng, adidas còn là cái tên tiên phong trong việc ứng dụng công nghệ hiện đại nhằm tối ưu hóa cảm giác bóng, tốc độ và khả năng kiểm soát trận đấu.

Tại Thanh Hùng Futsal – cửa hàng chuyên giày đá bóng adidas chính hãng tại TP.HCM, bạn sẽ dễ dàng tìm thấy các mẫu giày đá bóng sân cỏ nhân tạo adidas phù hợp với nhiều vị trí và phong cách thi đấu:

adidas F50 – Tăng tốc & linh hoạt: Thiết kế siêu nhẹ, ôm sát bàn chân, lý tưởng cho tiền đạo hoặc cầu thủ chạy cánh cần tốc độ và khả năng đảo hướng nhanh.

adidas Predator – Kiểm soát & chính xác: Thân giày có vân cao su giúp kiểm soát bóng hiệu quả, tăng độ xoáy và lực sút – phù hợp với tiền vệ trung tâm, trung vệ và cả thủ môn.

adidas Copa – Cảm giác bóng & thoải mái: Upper chất liệu da mềm mang lại cảm giác chạm bóng mượt mà, thoải mái cả trận – lý tưởng cho người chơi thiên về kiểm soát và phân phối bóng.`;

const AdidasBrand = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-20 max-w-7xl mx-auto px-4">
        <ProductsIntroduction name="Giày bóng đá adidas" description={description} image={productImage} />
        <ProductList products={sampleProducts} />
      </div>
      <Footer />
    </div>
  );
};

export default AdidasBrand;