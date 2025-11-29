import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductBox from './ProductBox.jsx';

// Hàm format tiền tệ (có thể tách ra file utils riêng nếu dùng nhiều nơi)
const formatVND = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
};

const FeaturedProductsList = ({ 
  products = [], 
  title = "Featured Products", 
  itemsPerPage = 4 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(products.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [products]);

  // Auto-slide logic
  useEffect(() => {
    if (totalPages <= 1) return; // Không auto-slide nếu chỉ có 1 trang

    const interval = setInterval(() => {
      setCurrentPage((prevPage) =>
        prevPage === totalPages ? 1 : prevPage + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [totalPages]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = products.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (!products || products.length === 0) {
    return null; 
  }

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        {title}
      </h2>

      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            {currentProducts.map((product) => (
              <ProductBox
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                oldPrice={product.oldPrice}
                salePercent={product.salePercent}
                imageUrl={product.imageUrl}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <span
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`w-3 h-3 rounded-full cursor-pointer transition-colors ${
                currentPage === index + 1
                  ? 'bg-blue-600'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            ></span>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeaturedProductsList;