import React, { useState, useEffect } from "react";
import ProductBox from "../Home/ProductBox";
import { Range } from "react-range";
import fallbackImage from "/giaybongda.jpg";

const ProductsList = ({
  products,
  minPrice = 0,
  maxPrice = 5000000,
  isBrand,
}) => {
  const [sortOption, setSortOption] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState({
    min: minPrice,
    max: maxPrice,
  });
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const productsPerPage = 12;

  useEffect(() => {
    setCurrentPage(1);
  }, [sortOption, priceRange, selectedSize, selectedColor, selectedBrand]);

  const filterProducts = (products) => {
    let filtered = [...products];

    filtered = filtered.filter(
      (p) => p.basePrice >= priceRange.min && p.basePrice <= priceRange.max
    );

    if (selectedSize)
      filtered = filtered.filter((p) => p.size === selectedSize);
    if (selectedColor)
      filtered = filtered.filter((p) => p.color === selectedColor);
    if (!isBrand && selectedBrand)
      filtered = filtered.filter((p) => p.brand === selectedBrand);

    return filtered;
  };

  const sortProducts = (products) => {
    let sorted = [...products];
    switch (sortOption) {
      case "priceLowToHigh":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "priceHighToLow":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "bestSelling":
        sorted.sort((a, b) => b.sales - a.sales);
        break;
      default:
        sorted.sort((a, b) => a._id.localeCompare(b._id));
        break;
    }
    return sorted;
  };

  const filteredProducts = filterProducts(products);
  const sortedProducts = sortProducts(filteredProducts);

  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const Checkbox = ({ id, label, checked, onChange }) => (
    <label
      htmlFor={id}
      className="flex items-center gap-2 cursor-pointer select-none mb-1"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="hidden"
      />
      <span
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
        ${checked ? "bg-blue-500 border-blue-500" : "border-gray-400"}`}
      >
        {checked && <span className="w-2 h-2 bg-white rounded-full" />}
      </span>
      <span className="text-sm">{label}</span>
    </label>
  );

  return (
    <div className="container mx-auto p-4 flex">
      {/* Sidebar */}
      <div className="w-1/6 p-4 border-r">
        <div className="mb-6">
          <h4 className="font-medium mb-2">Giá</h4>
          <Range
            step={100000}
            min={minPrice}
            max={maxPrice}
            values={[priceRange.min, priceRange.max]}
            onChange={(values) =>
              setPriceRange({ min: values[0], max: values[1] })
            }
            renderTrack={({ props, children }) => (
              <div
                {...props}
                className="h-1 w-full bg-gray-300 rounded-full relative"
              >
                <div
                  className="h-1 bg-blue-500 rounded-full absolute"
                  style={{
                    left: `${
                      ((priceRange.min - minPrice) / (maxPrice - minPrice)) *
                      100
                    }%`,
                    width: `${
                      ((priceRange.max - priceRange.min) /
                        (maxPrice - minPrice)) *
                      100
                    }%`,
                  }}
                />
                {children}
              </div>
            )}
            renderThumb={({ props }) => (
              <div
                {...props}
                className="w-4 h-4 bg-blue-500 rounded-full border border-white shadow-md cursor-pointer"
                style={{
                  ...props.style,
                }}
              />
            )}
          />
          <div className="flex justify-between text-sm mt-2">
            <span>{priceRange.min.toLocaleString()}đ</span>
            <span>{priceRange.max.toLocaleString()}đ</span>
          </div>
        </div>

        {/* Kích thước */}
        <div className="mb-6">
          <h4 className="font-medium mb-2">Kích thước</h4>
          {["L", "XL", "M", "S", "X"].map((size) => (
            <Checkbox
              key={size}
              id={size}
              label={size}
              checked={selectedSize === size}
              onChange={() =>
                setSelectedSize(selectedSize === size ? "" : size)
              }
            />
          ))}
        </div>

        {/* Màu sắc */}
        <div className="mb-6">
          <h4 className="font-medium mb-2">Màu sắc</h4>
          {["Trắng", "Đen", "Xám", "Xanh", "Nâu", "Hồng", "Đỏ"].map((color) => (
            <Checkbox
              key={color}
              id={color}
              label={color}
              checked={selectedColor === color}
              onChange={() =>
                setSelectedColor(selectedColor === color ? "" : color)
              }
            />
          ))}
        </div>

        {/* Hãng */}
        {!isBrand && (
          <div className="mb-6">
            <h4 className="font-medium mb-2">Hãng</h4>
            {["Adidas", "Nike", "Puma", "Các hãng khác"].map((brand) => (
              <Checkbox
                key={brand}
                id={brand}
                label={brand}
                checked={selectedBrand === brand}
                onChange={() =>
                  setSelectedBrand(selectedBrand === brand ? "" : brand)
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Product list */}
      <div className="w-5/6 p-4">
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

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {currentProducts.map((product) => (
            <ProductBox
              key={product._id}
              name={product.name}
              price={product.basePrice}
              oldPrice={product.oldPrice || product.basePrice}
              discountPercent={product.discountPercent || 0}
              imageUrl={product.imageUrl || fallbackImage}
            />
          ))}
        </div>

        {/* Pagination */}
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
    </div>
  );
};

export default ProductsList;
