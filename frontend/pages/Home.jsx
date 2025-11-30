import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import axiosClient from "../api/axiosClient";

import Navbar from "../components/Shared/Navbar";
import Hero from "../components/Home/Hero";
import FeaturedProductsList from "../components/Home/FeaturedProductsList";
import ProductSections from "../components/Home/ProductSections";
import Footer from "../components/Shared/Footer";

const Home = () => {
  const [featureProducts, setFeatureProducts] = useState([]);
  const [discountProducts, setDiscountProducts] = useState([]);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [featureRes, discountRes] = await Promise.all([
          axiosClient.get("/products/feature?limit=16"),   
          axiosClient.get("/products/discount?limit=16") 
        ]);

        setFeatureProducts(featureRes.data);
        setDiscountProducts(discountRes.data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu trang chủ:", error);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Helmet>
        <title>Shop bóng đá - Trang chủ</title>
      </Helmet>
      
      <Hero />
      
      <div className="pt-20 max-w-7xl mx-auto px-4 space-y-16 mb-20">
        <ProductSections />
        
        <FeaturedProductsList 
          products={featureProducts} 
          title="Sản Phẩm Bán Chạy Nhất" 
        />

        {discountProducts.length > 0 && (
          <FeaturedProductsList 
            products={discountProducts} 
            title="Đang Giảm Giá Sốc" 
          />
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Home;