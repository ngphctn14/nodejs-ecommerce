import React from 'react';

const ProductBox = ({ name, price, oldPrice, salePercent, imageUrl }) => {
  const isOnSale = salePercent && salePercent > 0 && oldPrice && oldPrice > price;

  const formatPrice = (value) => {
    if (!value) return '';
    return value.toLocaleString('vi-VN');
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden w-64 hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img src={imageUrl} alt={name} className="w-full h-48 object-cover" />
        {isOnSale && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            {salePercent}% OFF
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 truncate">{name}</h3>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xl font-bold text-gray-900">
            {formatPrice(price)} ₫
          </span>
          {isOnSale && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(oldPrice)} ₫
            </span>
          )}
        </div>
        <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors duration-200">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductBox;
