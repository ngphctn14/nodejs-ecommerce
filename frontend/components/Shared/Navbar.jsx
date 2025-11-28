import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ShoppingCart, User, ChevronDown, Menu } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import axiosClient from "../../api/axiosClient";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItemAmount, setCartItemAmount] = useState(0);
  const { user, logout } = useContext(AuthContext);

  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandsRes, categoriesRes] = await Promise.all([
          axiosClient.get("/brands"),
          axiosClient.get("/categories"),
        ]);
        setBrands(brandsRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error("Error fetching brands/categories:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchCartCount = async () => {
      if (user) {
        setIsLoggedIn(true);
        try {
          const res = await axiosClient.get(`/cart-items/${user.cartId}`);
          const totalQuantity = res.data.reduce(
            (total) => total + 1,
            0
          );
          setCartItemAmount(totalQuantity);
        } catch (err) {
          console.error("Failed to fetch cart count:", err);
          setCartItemAmount(0);
        }
      } else {
        setIsLoggedIn(false);
        const localCart = JSON.parse(localStorage.getItem("cart")) || [];
        const totalQuantity = localCart.reduce(
          (total) => total + 1,
          0
        );
        setCartItemAmount(totalQuantity);
      }
    };

    fetchCartCount();
  }, [user, cartItemAmount]);

  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <nav className="bg-white shadow-lg fixed w-full z-50 top-0">
      <div className="w-full px-2 sm:px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-800 hover:text-gray-600 p-2"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>

          <div className="hidden lg:flex items-center space-x-6">
            <a
              href="/products"
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              Tất cả sản phẩm
            </a>

            <div className="relative group">
              <button className="flex items-center text-gray-700 hover:text-gray-900 font-medium">
                Thương hiệu
                <ChevronDown className="ml-1 h-4 w-4 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                {brands.map((brand) => (
                  <a
                    key={brand.name}
                    href={`/brands/${brand.slug}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {brand.name}
                  </a>
                ))}
              </div>
            </div>

            <div className="relative group">
              <button className="flex items-center text-gray-700 hover:text-gray-900 font-medium">
                Loại sản phẩm
                <ChevronDown className="ml-1 h-4 w-4 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                {categories.map((category) => (
                  <a
                    key={category.name}
                    href={`/categories/${category.slug}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {category.name}
                  </a>
                ))}
              </div>
            </div>

            <a
              href="/advanced-search"
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              Tìm kiếm nâng cao
            </a>
          </div>

          <div className="absolute left-1/2 transform -translate-x-1/2">
            <a href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-900">
                Shop bóng đá
              </span>
            </a>
          </div>

          <div className="flex items-center space-x-6">
            <div className="relative">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="text-gray-700 hover:text-gray-900 p-2"
              >
                <Search className="h-6 w-6" />
              </button>
              {isSearchOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-md shadow-lg p-3 transition-all duration-200 z-10">
                  <form onSubmit={handleSearchSubmit}>
                    <input
                      type="text"
                      placeholder="Tìm kiếm sản phẩm..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-3 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                    />
                  </form>
                </div>
              )}
            </div>

            <a
              href="/cart"
              className="text-gray-700 hover:text-gray-900 p-2 relative"
            >
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemAmount}
              </span>
            </a>

            {isLoggedIn ? (
              <div className="relative group">
                <button className="flex items-center text-gray-700 hover:text-gray-900 p-2">
                  <User className="h-6 w-6" />
                  <ChevronDown className="ml-1 h-4 w-4 transition-transform group-hover:rotate-180" />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  <a
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Hồ sơ
                  </a>
                  <a
                    href="/orders"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Đơn hàng
                  </a>
                  <button
                    onClick={() => {
                      logout();
                      handleLogout();
                    }}
                    style={{ cursor: "pointer" }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
            ) : (
              <>
                <a
                  href="/login"
                  className="text-gray-700 hover:text-gray-900 font-medium"
                >
                  Đăng nhập
                </a>
                <a
                  href="/signup"
                  className="text-gray-700 hover:text-gray-900 font-medium"
                >
                  Đăng ký
                </a>
              </>
            )}
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a
                href="/products"
                className="block px-3 py-2 text-gray-700 hover:text-gray-900 font-medium"
              >
                Tất cả sản phẩm
              </a>
              <div className="relative group">
                <span className="block px-3 py-2 text-gray-700 font-medium">
                  Thương hiệu
                </span>
                {brands.map((brand) => (
                  <a
                    key={brand.name}
                    href={`/brands/${brand.slug}`}
                    className="block pl-6 py-1 text-sm text-gray-600 hover:text-gray-900"
                  >
                    {brand.name}
                  </a>
                ))}
              </div>
              <div className="relative group">
                <span className="block px-3 py-2 text-gray-700 font-medium">
                  Loại giày
                </span>
                {categories.map((category) => (
                  <a
                    key={category.name}
                    href={`/categories/${category.slug}`}
                    className="block pl-6 py-1 text-sm text-gray-600 hover:text-gray-900"
                  >
                    {category.name}
                  </a>
                ))}
              </div>
              <a
                href="/advanced-search"
                className="block px-3 py-2 text-gray-700 hover:text-gray-900 font-medium"
              >
                Tìm kiếm nâng cao
              </a>
              {!isLoggedIn && (
                <a
                  href="/login"
                  className="block px-3 py-2 text-gray-700 hover:text-gray-900 font-medium"
                >
                  Đăng nhập/Đăng ký
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
