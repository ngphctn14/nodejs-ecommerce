import React from "react";
import Navbar from "../../../components/Shared/Navbar";
import Footer from "../../../components/Shared/Footer";
import ProductList from "../../../components/Products/ProductsList"; 
import ProductsIntroduction from "../../../components/Products/ProductsIntroduction";
import image from '/giaybongda.jpg';
import productImage from '/typeImage/futsal.jpg'


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
Là dòng giày đá bóng được thiết kế đặc biệt dành cho mặt sân sàn gỗ hoặc bê tông, với bề mặt đế IC (Non-Marking) bằng phẳng cùng các rãnh nhỏ giúp tăng độ bám, hỗ trợ tối đa khả năng kiểm soát bóng bằng gầm giày, xoay trở linh hoạt và thực hiện các động tác kỹ thuật.

Tại Thanh Hùng Futsal, bạn có thể dễ dàng trải nghiệm những mẫu giày Futsal mới nhất và được săn đón nhiều nhất từ các thương hiệu hàng đầu trong và ngoài nước hiện nay như Nike, Joma, adidas, Mizuno, Joma, Asics, Desporte và Kamito.
`;
const Futsal = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-20 max-w-7xl mx-auto px-4">
        <ProductsIntroduction name="Giày bóng đá sân futsal" description={description} image={productImage} />
        <ProductList products={sampleProducts} />
      </div>
      <Footer />
    </div>
  );
};

export default Futsal;