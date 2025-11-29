import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ShoppingCart, User, ChevronDown, Menu, X } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import axiosClient from "../../api/axiosClient";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItemAmount, setCartItemAmount] = useState(0);
  const [expandedMobileMenu, setExpandedMobileMenu] = useState(null);
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
          const totalQuantity = res.data.reduce((total) => total + 1, 0);
          setCartItemAmount(totalQuantity);
        } catch (err) {
          console.error("Failed to fetch cart count:", err);
          setCartItemAmount(0);
        }
      } else {
        setIsLoggedIn(false);
        const localCart = JSON.parse(localStorage.getItem("cart")) || [];
        const totalQuantity = localCart.reduce((total) => total + 1, 0);
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

  const toggleMobileSubmenu = (menu) => {
    setExpandedMobileMenu(expandedMobileMenu === menu ? null : menu);
  };

  return (
    <nav className="bg-white shadow-lg fixed w-full z-50 top-0">
      <div className="w-full px-3 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-800 hover:text-gray-600 p-1.5 sm:p-2"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Desktop navigation */}
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

          {/* Logo - Center */}
          <div className="flex-1 flex justify-center lg:flex-initial lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2">
            <a href="/" className="flex items-center">
              <span className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">
                Shop bóng đá
              </span>
            </a>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
            {/* Search */}
            <div className="relative">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="text-gray-700 hover:text-gray-900 p-1.5 sm:p-2"
                aria-label="Search"
              >
                <Search className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
              {isSearchOpen && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border border-gray-200 rounded-md shadow-lg p-3 z-10">
                  <form onSubmit={handleSearchSubmit}>
                    <input
                      type="text"
                      placeholder="Tìm kiếm sản phẩm..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </form>
                </div>
              )}
            </div>

            {/* Cart */}
            <a
              href="/cart"
              className="text-gray-700 hover:text-gray-900 p-1.5 sm:p-2 relative"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
              {cartItemAmount > 0 && (
                <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center font-semibold">
                  {cartItemAmount}
                </span>
              )}
            </a>

            {/* User menu - Desktop only */}
            {isLoggedIn ? (
              <div className="hidden sm:block relative group">
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
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-4">
                <a
                  href="/login"
                  className="text-gray-700 hover:text-gray-900 font-medium text-sm lg:text-base"
                >
                  Đăng nhập
                </a>
                <a
                  href="/signup"
                  className="text-gray-700 hover:text-gray-900 font-medium text-sm lg:text-base"
                >
                  Đăng ký
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 max-h-[calc(100vh-3.5rem)] overflow-y-auto">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a
                href="/products"
                className="block px-3 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-medium rounded-md"
              >
                Tất cả sản phẩm
              </a>

              {/* Brands */}
              <div>
                <button
                  onClick={() => toggleMobileSubmenu("brands")}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-gray-700 hover:bg-gray-50 font-medium rounded-md"
                >
                  Thương hiệu
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      expandedMobileMenu === "brands" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {expandedMobileMenu === "brands" && (
                  <div className="pl-4 space-y-1 mt-1">
                    {brands.map((brand) => (
                      <a
                        key={brand.name}
                        href={`/brands/${brand.slug}`}
                        className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
                      >
                        {brand.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Categories */}
              <div>
                <button
                  onClick={() => toggleMobileSubmenu("categories")}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-gray-700 hover:bg-gray-50 font-medium rounded-md"
                >
                  Loại sản phẩm
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      expandedMobileMenu === "categories" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {expandedMobileMenu === "categories" && (
                  <div className="pl-4 space-y-1 mt-1">
                    {categories.map((category) => (
                      <a
                        key={category.name}
                        href={`/categories/${category.slug}`}
                        className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
                      >
                        {category.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <a
                href="/advanced-search"
                className="block px-3 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-medium rounded-md"
              >
                Tìm kiếm nâng cao
              </a>

              {/* Mobile user menu */}
              {isLoggedIn ? (
                <div className="border-t border-gray-200 pt-2 mt-2 sm:hidden">
                  <button
                    onClick={() => toggleMobileSubmenu("user")}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-gray-700 hover:bg-gray-50 font-medium rounded-md"
                  >
                    <span className="flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Tài khoản
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        expandedMobileMenu === "user" ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {expandedMobileMenu === "user" && (
                    <div className="pl-4 space-y-1 mt-1">
                      <a
                        href="/profile"
                        className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
                      >
                        Hồ sơ
                      </a>
                      <a
                        href="/orders"
                        className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
                      >
                        Đơn hàng
                      </a>
                      <button
                        onClick={() => {
                          logout();
                          handleLogout();
                        }}
                        className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="border-t border-gray-200 pt-2 mt-2 sm:hidden space-y-1">
                  <a
                    href="/login"
                    className="block px-3 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-medium rounded-md"
                  >
                    Đăng nhập
                  </a>
                  <a
                    href="/signup"
                    className="block px-3 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-medium rounded-md"
                  >
                    Đăng ký
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;