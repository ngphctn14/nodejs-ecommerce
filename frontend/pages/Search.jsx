import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Shared/Navbar";
import Footer from "../components/Shared/Footer";
import ProductList from "../components/Products/ProductsList"; 
import axiosClient from "../api/axiosClient";
import { Helmet } from "react-helmet";

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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Helmet>
        <title>{`Tìm kiếm | ${searchTerm}`}</title>
      </Helmet>
      <Navbar onSearch={handleSearch} />
      <main className="flex flex-1 items-center justify-center text-center px-6">
      <div className="pt-20 max-w-7xl mx-auto px-4">
        {loading ? (
          <p className="text-center py-10">Đang tải sản phẩm...</p>
        ) : products.length ? (
          <ProductList products={products} />
        ) : (
          <p className="text-center py-10">Không tìm thấy sản phẩm nào cho "{searchTerm}"</p>
        )}
      </div>
      </main>
      <Footer />
    </div>
  );
};

export default SearchPage;
