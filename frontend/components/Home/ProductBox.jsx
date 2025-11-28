import React from 'react';
import { Link } from 'react-router-dom';

const ProductBox = ({ 
  name, 
  price, 
  oldPrice, 
  discountPercent,
  imageUrl,
  _id
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
      className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 w-full"
    >
      {/* Image Container với aspect ratio cố định */}
      <div className="relative w-full pt-[125%]">
        <img 
          src={imageUrl} 
          alt={name} 
          className="absolute inset-0 w-full h-full object-cover"
        />
        {displaySalePercent && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-md">
            -{displaySalePercent}%
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3 sm:p-4">
        <h3 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem]">
          {name}
        </h3>
        
        <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
          <span className="text-base sm:text-lg font-bold text-gray-900">
            {formatPrice(price)} ₫
          </span>
          {displayOldPrice && (
            <span className="text-xs sm:text-sm text-gray-500 line-through">
              {formatPrice(displayOldPrice)} ₫
            </span>
          )}
        </div>

        <button 
          onClick={(e) => {
            e.preventDefault();
            window.location.href = `/product/${_id}`;
          }}
          className="mt-3 sm:mt-4 w-full bg-blue-600 text-white py-2 sm:py-2.5 text-sm sm:text-base rounded hover:bg-blue-700 transition-colors duration-200 font-medium"
        >
          Xem chi tiết
        </button>
      </div>
    </Link>
  );
};

export default ProductBox;