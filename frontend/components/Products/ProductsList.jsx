import React, { useState, useEffect, useMemo } from "react";
import ProductBox from "../Home/ProductBox";
import { Range } from "react-range";
import { ChevronDown, ChevronUp, Filter, DollarSign, ChevronLeft, ChevronRight, X } from "lucide-react";

const ProductsList = ({ products = [], minPrice = 0, maxPrice = 50000000, isBrand }) => {
  const [filters, setFilters] = useState({
    minPrice: minPrice,
    maxPrice: maxPrice,
    color: "",
    size: "",
    brand: "",
    sort: "default"
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const productsPerPage = 12;

  // Calculate Filter Options
  const filterOptions = useMemo(() => {
    const colors = new Set();
    const sizes = new Set();
    
    products.forEach(product => {
      if (product.variants && product.variants.length > 0) {
        product.variants.forEach(v => {
          if (v.attributes?.color) colors.add(v.attributes.color);
          if (v.attributes?.size) sizes.add(v.attributes.size);
        });
      }
      if (product.color) colors.add(product.color);
      if (product.size) sizes.add(product.size);
    });

    const rawSizes = Array.from(sizes);

    // 1. Filter and Sort Numeric Sizes (38, 39, 40.5, etc.)
    const numericSizes = rawSizes
      .filter(s => !isNaN(s) && !isNaN(parseFloat(s))) // Check if it is a number
      .sort((a, b) => parseFloat(a) - parseFloat(b)); // Numeric sort

    // 2. Filter and Sort Letter Sizes (S, M, L, XL, etc.)
    const sizeOrder = { 'XXS': 0, 'XS': 1, 'S': 2, 'M': 3, 'L': 4, 'XL': 5, 'XXL': 6, '2XL': 6, '3XL': 7, '4XL': 8 };
    const letterSizes = rawSizes
      .filter(s => isNaN(s)) // Check if it is NOT a number
      .sort((a, b) => {
        const orderA = sizeOrder[a.toUpperCase()] ?? 99; // Default to 99 if not found
        const orderB = sizeOrder[b.toUpperCase()] ?? 99;
        return orderA - orderB;
      });

    return {
      colors: Array.from(colors).sort(),
      numericSizes,
      letterSizes,
      // Keep a combined list just in case checks need it, though we use split lists for UI
      allSizes: rawSizes 
    };
  }, [products]);

  // Client-Side Filtering & Sorting
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    result = result.filter(p => {
      const matchPrice = p.basePrice >= filters.minPrice && p.basePrice <= filters.maxPrice;
      
      let matchColor = true;
      let matchSize = true;
      let matchBrand = true;

      if (filters.color) {
        if (p.variants && p.variants.length > 0) {
          matchColor = p.variants.some(v => v.attributes?.color === filters.color);
        } else {
          matchColor = p.color === filters.color;
        }
      }

      if (filters.size) {
        if (p.variants && p.variants.length > 0) {
          matchSize = p.variants.some(v => v.attributes?.size === filters.size);
        } else {
          matchSize = p.size === filters.size;
        }
      }

      if (!isBrand && filters.brand) {
        matchBrand = p.brand === filters.brand || p.brand?.name === filters.brand; 
      }

      return matchPrice && matchColor && matchSize && matchBrand;
    });

    switch (filters.sort) {
      case "priceLowToHigh":
        result.sort((a, b) => a.basePrice - b.basePrice);
        break;
      case "priceHighToLow":
        result.sort((a, b) => b.basePrice - a.basePrice);
        break;
      case "newest":
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "bestSelling":
        result.sort((a, b) => (b.sales || 0) - (a.sales || 0));
        break;
      default:
        break;
    }

    return result;
  }, [products, filters, isBrand]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileFilterOpen]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredAndSortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const clearFilters = () => {
    setFilters({
      minPrice: minPrice,
      maxPrice: maxPrice,
      color: "",
      size: "",
      brand: "",
      sort: "default"
    });
  };

  const activeFiltersCount = [
    filters.minPrice !== minPrice || filters.maxPrice !== maxPrice,
    filters.color,
    filters.size,
    filters.brand
  ].filter(Boolean).length;

  // Components
  const Checkbox = ({ id, label, checked, onChange }) => (
    <label htmlFor={id} className="flex items-center gap-2 cursor-pointer select-none mb-2 group">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="hidden"
      />
      <span className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${checked ? "bg-blue-500 border-blue-500 text-white" : "border-gray-300 bg-white"}`}>
        {checked && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
      </span>
      <span className="text-sm text-gray-700 group-hover:text-gray-900">{label}</span>
    </label>
  );

  const SizeButton = ({ size }) => (
    <button
      onClick={() => setFilters({...filters, size: filters.size === size ? "" : size})}
      className={`py-2 text-sm border rounded hover:border-blue-500 transition-colors
        ${filters.size === size ? 'bg-blue-50 border-blue-500 text-blue-700 font-medium' : 'border-gray-200 text-gray-600'}
      `}
    >
      {size}
    </button>
  );

  // Filter Panel Component
  const FilterPanel = ({ isMobile = false }) => (
    <div className={`space-y-6 ${isMobile ? 'p-4' : ''}`}>
      {/* Price Filter */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <DollarSign className="w-4 h-4" /> Khoảng giá
        </h3>
        <Range
          step={50000}
          min={minPrice}
          max={maxPrice}
          values={[filters.minPrice, filters.maxPrice]}
          onChange={(values) => setFilters({ ...filters, minPrice: values[0], maxPrice: values[1] })}
          renderTrack={({ props, children }) => (
            <div {...props} className="h-1.5 w-full bg-gray-200 rounded-full relative">
              <div
                className="h-1.5 bg-blue-500 rounded-full absolute"
                style={{
                  left: `${((filters.minPrice - minPrice) / (maxPrice - minPrice)) * 100}%`,
                  width: `${((filters.maxPrice - filters.minPrice) / (maxPrice - minPrice)) * 100}%`,
                }}
              />
              {children}
            </div>
          )}
          renderThumb={({ props }) => (
            <div {...props} className="w-5 h-5 bg-white rounded-full border-2 border-blue-500 shadow-md focus:outline-none" />
          )}
        />
        <div className="flex justify-between text-sm mt-3 text-gray-600 font-medium">
          <span>{filters.minPrice.toLocaleString()}đ</span>
          <span>{filters.maxPrice.toLocaleString()}đ</span>
        </div>
      </div>

      {/* Size Filter - Categorized */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Kích thước</h3>
        
        {/* Render Numeric Sizes if any */}
        {filterOptions.numericSizes.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Số</p>
            <div className="grid grid-cols-3 gap-2">
              {filterOptions.numericSizes.map(size => (
                <SizeButton key={`num-${size}`} size={size} />
              ))}
            </div>
          </div>
        )}

        {/* Render Letter Sizes if any */}
        {filterOptions.letterSizes.length > 0 && (
          <div>
            <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Chữ</p>
            <div className="grid grid-cols-3 gap-2">
              {filterOptions.letterSizes.map(size => (
                <SizeButton key={`let-${size}`} size={size} />
              ))}
            </div>
          </div>
        )}

        {/* Fallback if no sizes exist */}
        {filterOptions.numericSizes.length === 0 && filterOptions.letterSizes.length === 0 && (
           <p className="text-sm text-gray-400">Không có</p>
        )}
      </div>

      {/* Color Filter */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Màu sắc</h3>
        <div className="flex flex-col gap-1">
          {filterOptions.colors.length > 0 ? filterOptions.colors.map(color => (
            <Checkbox
              key={color}
              id={`color-${color}${isMobile ? '-mobile' : ''}`}
              label={color}
              checked={filters.color === color}
              onChange={() => setFilters({...filters, color: filters.color === color ? "" : color})}
            />
          )) : <p className="text-sm text-gray-400">Không có</p>}
        </div>
      </div>
    </div>
  );
  console.log(products)

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-1/4 xl:w-1/5">
          <div className="sticky top-20">
            <FilterPanel />
          </div>
        </div>

        {/* Mobile Filter Button & Drawer */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-700 font-medium hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Filter className="w-5 h-5" />
            Bộ lọc
            {activeFiltersCount > 0 && (
              <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5 font-semibold">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Mobile Filter Drawer */}
          {isMobileFilterOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              {/* Backdrop */}
              <div 
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={() => setIsMobileFilterOpen(false)}
              />
              
              {/* Drawer */}
              <div className="absolute right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="text-lg font-semibold text-gray-900">Bộ lọc</h2>
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Filter Content */}
                <div className="flex-1 overflow-y-auto">
                  <FilterPanel isMobile={true} />
                </div>

                {/* Footer */}
                <div className="border-t p-4 space-y-2">
                  <button
                    onClick={clearFilters}
                    className="w-full py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Xóa bộ lọc
                  </button>
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                  >
                    Xem {filteredAndSortedProducts.length} sản phẩm
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {/* Sort Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-100">
            <p className="text-gray-500 text-sm">
              Hiển thị <strong className="text-gray-900">{filteredAndSortedProducts.length}</strong> sản phẩm
            </p>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-sm text-gray-600 hidden sm:inline">Sắp xếp:</span>
              <select
                value={filters.sort}
                onChange={(e) => setFilters({...filters, sort: e.target.value})}
                className="flex-1 sm:flex-initial border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="default">Mặc định</option>
                <option value="newest">Mới nhất</option>
                <option value="bestSelling">Bán chạy nhất</option>
                <option value="priceLowToHigh">Giá: Thấp đến Cao</option>
                <option value="priceHighToLow">Giá: Cao đến Thấp</option>
              </select>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-16 sm:py-20">
              <p className="text-gray-500 text-base sm:text-lg">Không có sản phẩm nào.</p>
            </div>
          ) : filteredAndSortedProducts.length === 0 ? (
            <div className="text-center py-16 sm:py-20">
              <p className="text-gray-500 text-base sm:text-lg mb-3">Không tìm thấy sản phẩm phù hợp.</p>
              <button 
                onClick={clearFilters}
                className="text-blue-600 hover:underline font-medium"
              >
                Xóa bộ lọc
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {currentProducts.map((product) => {
                const percent = product.discountPercent || 0;
                const hasDiscount = percent > 0;

                // Nếu có giảm giá thì tính giá sau giảm, còn không thì dùng basePrice luôn
                const finalPrice = hasDiscount
                  ? Math.round(product.basePrice * (1 - percent / 100))
                  : product.basePrice;

                return (
                  <ProductBox
                    key={product._id}
                    _id={product._id}
                    name={product.name}
                    price={finalPrice}                            
                    oldPrice={hasDiscount ? product.basePrice : null} 
                    salePercent={percent}
                    imageUrl={product.imageUrl || "https://via.placeholder.com/300x400?text=Product"}
                  />
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 sm:mt-10">
              {/* Mobile Pagination */}
              <div className="flex sm:hidden justify-between items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex-1 flex items-center justify-center gap-1 px-4 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm font-medium"
                >
                  <ChevronLeft size={18} />
                  Trước
                </button>
                <span className="text-sm font-medium text-gray-700 px-2 whitespace-nowrap">
                  {currentPage}/{totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex-1 flex items-center justify-center gap-1 px-4 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm font-medium"
                >
                  Sau
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* Desktop Pagination */}
              <div className="hidden sm:flex justify-center items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="text-sm font-medium text-gray-700 mx-2">
                  Trang {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsList;