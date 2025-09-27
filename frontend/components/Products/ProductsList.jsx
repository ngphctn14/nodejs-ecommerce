import React, { useState, useEffect } from 'react';
import ProductBox from '../Home/ProductBox';

const ProductsList = ({ products }) => {
  const [sortOption, setSortOption] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  useEffect(() => {
    setCurrentPage(1);
  }, [sortOption]);

  const sortProducts = (products) => {
    let sorted = [...products];
    switch (sortOption) {
      case 'priceLowToHigh':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'priceHighToLow':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'bestSelling':
        sorted.sort((a, b) => b.sales - a.sales);
        break;
      default:
        sorted.sort((a, b) => a.id - b.id);
        break;
    }
    return sorted;
  };

  const sortedProducts = sortProducts(products);

  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' }); 
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex justify-end">
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="border border-gray-300 rounded-md p-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="default">Mặc định</option>
          <option value="priceLowToHigh">Giá: Thấp đến Cao</option>
          <option value="priceHighToLow">Giá: Cao đến Thấp</option>
          <option value="newest">Sản phẩm mới nhất</option>
          <option value="bestSelling">Sản phẩm bán chạy nhất</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {currentProducts.map((product) => (
          <ProductBox
            key={product.id}
            name={product.name}
            price={product.price}
            oldPrice={product.oldPrice}
            salePercent={product.salePercent}
            imageUrl={product.imageUrl}
          />
        ))}
      </div>

      <div className="mt-6 flex justify-center items-center gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-gray-700">
          Trang {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductsList;