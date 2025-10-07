import React from "react";
import Navbar from "../../../components/Shared/Navbar";
import Footer from "../../../components/Shared/Footer";
import ProductList from "../../../components/Products/ProductsList"; 
import ProductsIntroduction from "../../../components/Products/ProductsIntroduction";
import image from '/giaybongda.jpg';
import productImage from '/brandImage/all.jpg'


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
Thanh Hùng Futsal – cửa hàng giày đá bóng chính hãng tại TP.HCM, tự hào mang đến bộ sưu tập đa dạng từ các thương hiệu hàng đầu như Mizuno, Joma, ASICS, Kamito và Zocker. Mỗi thương hiệu đều sở hữu công nghệ độc đáo, đáp ứng mọi phong cách thi đấu trên sân cỏ nhân tạo và futsal, từ tốc độ bùng nổ đến kiểm soát bóng tinh tế.

- Mizuno – Chất lượng Nhật Bản: Nổi tiếng với độ bền và cảm giác bóng đỉnh cao, Mizuno Morelia và Rebula mang lại sự thoải mái, kiểm soát bóng mượt mà, lý tưởng cho tiền vệ tổ chức hoặc cầu thủ kỹ thuật. Mizuno Alpha tối ưu cho tốc độ, phù hợp với tiền đạo và chạy cánh.

- Joma – Sự linh hoạt từ Tây Ban Nha: Joma Top Flex và Liga mang đến độ bám vượt trội và thoải mái, hoàn hảo cho tiền vệ, hậu vệ hoặc thủ môn trên sân futsal. Joma FS Reactive hỗ trợ tốc độ và phản ứng nhanh cho các pha bứt phá.

- ASICS – Bảo vệ & hiệu suất: Với công nghệ HG10mm và FlyteFoam, ASICS DS Light và Gel-Lethal cung cấp sự ổn định, giảm chấn, lý tưởng cho hậu vệ hoặc tiền vệ phòng ngự. ASICS Accelera dành cho cầu thủ chạy cánh cần tốc độ và độ bám.

- Kamito – Phong cách Việt Nam: Kamito kết hợp thiết kế hiện đại và giá trị thực tiễn, với các dòng như Kamito TA và Kamito Pro nhẹ, bền, phù hợp cho tiền đạo hoặc tiền vệ công muốn thể hiện cá tính và tốc độ trên sân.

- Zocker – Đột phá & trẻ trung: Zocker Ignite và Zocker Blitz mang thiết kế năng động, đế TF bám chắc, lý tưởng cho futsal và sân nhân tạo. Phù hợp với cầu thủ trẻ, yêu thích tốc độ và sự linh hoạt trong từng pha bóng.
`;
const OthersBrand = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-20 max-w-7xl mx-auto px-4">
        <ProductsIntroduction name="Giày bóng đá các thương hiệu khác" description={description} image={productImage}/>
        <ProductList products={sampleProducts} isBrand = {true} />
      </div>
      <Footer />
    </div>
  );
};

export default OthersBrand;