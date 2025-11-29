import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Shared/Navbar";
import Footer from "../../components/Shared/Footer";
import ProductList from "../../components/Products/ProductsList";
import ProductsIntroduction from "../../components/Products/ProductsIntroduction";
import axiosClient from "../../api/axiosClient";
import {Helmet} from "react-helmet";

const CategoryPage = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const categoryRes = await axiosClient.get(`/categories/${slug}`);
        setCategory(categoryRes.data.category);

        const productsRes = await axiosClient.get(`/products/category/${slug}`);
        setProducts(productsRes.data);
      } catch (err) {
        console.error("Error fetching category data:", err);
      }
    };

    fetchCategoryData();
  }, [slug]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{`Sản phẩm | ${category?.name}`}</title>
      </Helmet>
      <Navbar />
      <div className="pt-20 max-w-7xl mx-auto px-4">
        <ProductsIntroduction
          name={category?.name}
          description={category?.description}
          image={category?.imageSrc}
        />
        <ProductList products={products} />
      </div>
      <Footer />
    </div>
  );
};

export default CategoryPage;
