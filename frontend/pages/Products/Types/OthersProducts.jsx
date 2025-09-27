import React from "react";
import Navbar from "../../../components/Shared/Navbar";
import Footer from "../../../components/Shared/Footer";
import ProductList from "../../../components/Products/ProductsList"; 
import ProductsIntroduction from "../../../components/Products/ProductsIntroduction";
import image from '/giaybongda.jpg';
import productImage from '/typeImage/others.jpg'


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
Thanh Hùng Futsal tự hào là đại lý phân phối chính hãng các sản phẩm phụ kiện đến từ các thương hiệu nổi tiếng như Activital - vớ thể thao, Grandsport - phụ kiện thể thao, StarBalm - chai xịt nóng, lạnh, Bóng Động Lực - trái banh thi đấu chính thức tại các giải đấu lớn.
`;
const OthersProducts = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-20 max-w-7xl mx-auto px-4">
        <ProductsIntroduction name="Các sản phẩm khác" description={description} image={productImage}/>
        <ProductList products={sampleProducts} />
      </div>
      <Footer />
    </div>
  );
};

export default OthersProducts;