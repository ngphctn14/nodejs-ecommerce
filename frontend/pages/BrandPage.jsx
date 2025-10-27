import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Shared/Navbar";
import Footer from "../components/Shared/Footer";
import ProductList from "../components/Products/ProductsList";
import ProductsIntroduction from "../components/Products/ProductsIntroduction";
import axiosClient from "../api/axiosClient";

const BrandPage = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [brand, setBrand] = useState(null);

  useEffect(() => {
    const fetchBrandData = async () => {
      try {
        const brandRes = await axiosClient.get(`/brands/${slug}`);
        setBrand(brandRes.data.brand);

        const productsRes = await axiosClient.get(`/products/brand/${slug}`);
        setProducts(productsRes.data);
      } catch (err) {
        console.error("Error fetching brand data:", err);
      }
    };

    fetchBrandData();
  }, [slug]);

  // const brandImage = brand
  //   ? `/brandImage/${brand.slug || slug}.jpg`
  //   : defaultBrandImage;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-20 max-w-7xl mx-auto px-4">
        <ProductsIntroduction
          name={brand?.name || "Sản phẩm thương hiệu"}
          description={
            brand?.description ||
            "Khám phá các sản phẩm chính hãng từ thương hiệu này."
          }
          // image={brandImage}
        />
        <ProductList products={products} isBrand={true} />
      </div>
      <Footer />
    </div>
  );
};

export default BrandPage;
