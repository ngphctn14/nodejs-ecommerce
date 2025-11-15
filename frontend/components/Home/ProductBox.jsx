import React from 'react';
import { Link } from 'react-router-dom'; // Thêm import này

const ProductBox = ({ 
  name, 
  price, 
  oldPrice, 
  discountPercent, // sửa tên từ salePercent → discountPercent cho đúng với ProductsList
  imageUrl,
  _id // Nhận thêm _id từ props
}) => {
  const parsedSalePercent = Number(discountPercent || 0);
  const isOnSale = parsedSalePercent > 0 && oldPrice && oldPrice > price;

  const displayOldPrice = isOnSale ? oldPrice : null;
  const displaySalePercent = isOnSale ? parsedSalePercent : null;

  const formatPrice = (value) => {
    if (!value) return '';
    return value.toLocaleString('vi-VN');
  };

  return (
    <Link 
      to={`/product/${_id}`} 
      className="block bg-white rounded-lg shadow-md overflow-hidden w-64 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="relative">
        <img src={imageUrl} alt={name} className="w-full h-48 object-cover" />
        {displaySalePercent && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{displaySalePercent}%
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 truncate">{name}</h3>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xl font-bold text-gray-900">
            {formatPrice(price)} ₫
          </span>
          {displayOldPrice && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(displayOldPrice)} ₫
            </span>
          )}
        </div>
        <button 
          onClick={(e) => e.preventDefault()} // Ngăn nút submit khi click
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors duration-200 pointer-events-none"
        >
          Xem chi tiết
        </button>
      </div>
    </Link>
  );
};

export default ProductBox;