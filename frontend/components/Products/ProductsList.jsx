import React, { useState, useEffect, useMemo } from "react";
import ProductBox from "../Home/ProductBox";
import { Range } from "react-range";
import { ChevronDown, ChevronUp, Filter, DollarSign, ChevronLeft, ChevronRight } from "lucide-react"; // Add icons

const ProductsList = ({ products = [], minPrice = 0, maxPrice = 50000000, isBrand }) => {
  // Selected Filters State
  const [filters, setFilters] = useState({
    minPrice: minPrice,
    maxPrice: maxPrice,
    color: "",
    size: "",
    brand: "",
    sort: "default"
  });

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  // --- 1. Calculate Filter Options Dynamically from Data ---
  const filterOptions = useMemo(() => {
    const colors = new Set();
    const sizes = new Set();
    
    products.forEach(product => {
      // Check variant attributes if available
      if (product.variants && product.variants.length > 0) {
          product.variants.forEach(v => {
              if (v.attributes?.color) colors.add(v.attributes.color);
              if (v.attributes?.size) sizes.add(v.attributes.size);
          });
      }
      // Fallback to product level fields if your data structure uses them flattened
      if (product.color) colors.add(product.color);
      if (product.size) sizes.add(product.size);
    });

    return {
      colors: Array.from(colors).sort(),
      sizes: Array.from(sizes).sort(),
    };
  }, [products]);


  // --- 2. Client-Side Filtering & Sorting Logic ---
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // A. Filter
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
             // Assuming product has a brand field or brandId populated with name
             // If it's an ID, this comparison might need adjustment based on your data
             // Checking against both just in case
             matchBrand = p.brand === filters.brand || p.brand?.name === filters.brand; 
        }

        return matchPrice && matchColor && matchSize && matchBrand;
    });

    // B. Sort
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
        // Default sort usually by ID or creation if not specified
        // result.sort((a, b) => a._id.localeCompare(b._id));
        break;
    }

    return result;
  }, [products, filters, isBrand]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);


  // --- 3. Pagination ---
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

  // --- Components ---
  const Checkbox = ({ id, label, checked, onChange, colorBox }) => (
    <label htmlFor={id} className="flex items-center gap-2 cursor-pointer select-none mb-2 group">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="hidden"
      />
      {colorBox ? (
         <div className={`w-6 h-6 rounded-full border shadow-sm transition-all ${checked ? 'ring-2 ring-blue-500 ring-offset-1 scale-110' : 'border-gray-200 group-hover:border-gray-400'}`} style={{ backgroundColor: label === 'Trắng' ? '#fff' : label === 'Đen' ? '#000' : 'gray' }}></div>
      ) : (
         <span className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${checked ? "bg-blue-500 border-blue-500 text-white" : "border-gray-300 bg-white"}`}>
            {checked && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
         </span>
      )}
      <span className="text-sm text-gray-700 group-hover:text-gray-900">{label}</span>
    </label>
  );

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
      {/* Sidebar Filters */}
      <div className="w-full md:w-1/4 lg:w-1/5 space-y-8">
        
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

        {/* Size Filter */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
             Kích thước
          </h3>
          <div className="grid grid-cols-3 gap-2">
             {filterOptions.sizes.length > 0 ? filterOptions.sizes.map(size => (
                <button
                   key={size}
                   onClick={() => setFilters({...filters, size: filters.size === size ? "" : size})}
                   className={`py-1.5 text-sm border rounded hover:border-blue-500 transition-colors
                     ${filters.size === size ? 'bg-blue-50 border-blue-500 text-blue-700 font-medium' : 'border-gray-200 text-gray-600'}
                   `}
                >
                   {size}
                </button>
             )) : <p className="text-sm text-gray-400 col-span-3">Không có</p>}
          </div>
        </div>

        {/* Color Filter */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
             Màu sắc
          </h3>
          <div className="flex flex-col gap-1">
            {filterOptions.colors.length > 0 ? filterOptions.colors.map(color => (
               <Checkbox
                  key={color}
                  id={`color-${color}`}
                  label={color}
                  checked={filters.color === color}
                  onChange={() => setFilters({...filters, color: filters.color === color ? "" : color})}
               />
            )) : <p className="text-sm text-gray-400">Không có</p>}
          </div>
        </div>

        {/* Brand Filter (Only if not a brand page) */}
        {!isBrand && (
             <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    Hãng
                </h3>
                <div className="flex flex-col gap-1">
                    {/* You might want to dynamically generate these too if needed */}
                    {["Adidas", "Nike", "Puma", "Khác"].map((brand) => (
                    <Checkbox
                        key={brand}
                        id={brand}
                        label={brand}
                        checked={filters.brand === brand}
                        onChange={() =>
                        setFilters({ ...filters, brand: filters.brand === brand ? "" : brand })
                        }
                    />
                    ))}
                </div>
            </div>
        )}

      </div>

      {/* Product Grid */}
      <div className="flex-1">
        {/* Sort Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 pb-4 border-b border-gray-100">
           <p className="text-gray-500 text-sm mb-2 sm:mb-0">Hiển thị <strong>{filteredAndSortedProducts.length}</strong> sản phẩm</p>
           <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sắp xếp:</span>
              <select
                value={filters.sort}
                onChange={(e) => setFilters({...filters, sort: e.target.value})}
                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
           <div className="text-center py-20">
              <p className="text-gray-500 text-lg">Không có sản phẩm nào.</p>
           </div>
        ) : filteredAndSortedProducts.length === 0 ? (
           <div className="text-center py-20">
              <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm phù hợp.</p>
              <button onClick={() => setFilters({minPrice: minPrice, maxPrice: maxPrice, color: "", size: "", sort: "default", brand: ""})} className="mt-4 text-blue-600 hover:underline">Xóa bộ lọc</button>
           </div>
        ) : (
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {currentProducts.map((product) => (
                <ProductBox
                  key={product._id}
                  _id={product._id}
                  name={product.name}
                  price={product.basePrice}
                  oldPrice={product.oldPrice || product.basePrice} // Use oldPrice if available
                  discountPercent={product.discountPercent || 0}
                  imageUrl={product.imageUrl || "https://via.placeholder.com/300x400?text=Product"} 
                />
              ))}
           </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex justify-center items-center gap-2">
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
        )}
      </div>
    </div>
  );
};

export default ProductsList;