import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../Forms/Button';

const ProductBox = ({
  name,
  price,
  oldPrice,
  discountPercent,
  salePercent,
  imageUrl,
  _id,
  id
}) => {
  const productId = _id || id;
  if (!productId) return null;

  const percent = Number(discountPercent || salePercent || 0);
  const isOnSale = percent > 0 && oldPrice && oldPrice > price;
  const displayOldPrice = isOnSale ? oldPrice : null;
  const displaySalePercent = isOnSale ? percent : null;

  const formatPrice = (value) => {
    if (!value) return '';
    return value.toLocaleString('vi-VN');
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 w-full flex flex-col">
      {/* Image */}
      <div className="relative w-full pt-[125%]">
        <img
          src={imageUrl}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        {displaySalePercent && (
          <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded shadow-md z-10">
            -{displaySalePercent}%
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <h3 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem] group-hover:text-blue-600 transition-colors">
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

        {/* Button */}
        <div className="mt-auto pt-3 sm:pt-4">
          <Link to={`/product/${productId}`}>
            <Button
              textContent="Xem chi tiết"
              className="w-full bg-blue-500 text-white font-medium py-2 rounded hover:bg-blue-600 transition-colors shadow-md"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductBox;
