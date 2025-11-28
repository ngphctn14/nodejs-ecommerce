import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Shared/Navbar";
import Footer from "../components/Shared/Footer";
import ProductList from "../components/Products/ProductsList"; 
import axiosClient from "../api/axiosClient";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const query = useQuery();
  const navigate = useNavigate();
  const searchTerm = query.get("q") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      if (!searchTerm) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await axiosClient.get("/products/search", {
          params: { q: searchTerm },
        });
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch search results:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchTerm]);

  // Optional: handle new searches (redirect with new query)
  const handleSearch = (newQuery) => {
    navigate(`/search?q=${encodeURIComponent(newQuery)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onSearch={handleSearch} />
      <div className="pt-20 max-w-7xl mx-auto px-4">
        {loading ? (
          <p className="text-center py-10">Đang tải sản phẩm...</p>
        ) : products.length ? (
          <ProductList products={products} />
        ) : (
          <p className="text-center py-10">Không tìm thấy sản phẩm nào cho "{searchTerm}"</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SearchPage;
