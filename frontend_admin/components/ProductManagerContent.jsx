import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Edit, Trash2, AlertCircle, X, DollarSign, Tag, ShoppingBag, Package,
  Package2, Palette, Ruler, ChevronDown, ChevronUp
} from 'lucide-react';

const ProductManagerContent = () => {
  const [products, setProducts] = useState([
    { 
      id: 1, 
      name: 'Áo Đấu Việt Nam 2024 SEA Games', 
      description: 'Phiên bản chính hãng Grand Sport, chất liệu thoáng khí', 
      category: 'Áo đấu', 
      brand: 'Adidas', 
      basePrice: 899000, 
      discountPercent: 10, 
      sales: 156,
      variants: [
        { id: 1, color: 'Đỏ', size: 'M', stock: 50 },
        { id: 2, color: 'Đỏ', size: 'L', stock: 30 },
        { id: 3, color: 'Trắng', size: 'XL', stock: 20 }
      ]
    },
    { 
      id: 2, 
      name: 'Giày Predator Edge.1 FG', 
      description: 'Giày đá bóng sân cỏ tự nhiên, công nghệ DemonSkin', 
      category: 'Giày đá bóng', 
      brand: 'Adidas', 
      basePrice: 3290000, 
      discountPercent: 15, 
      sales: 48,
      variants: [
        { id: 4, color: 'Đen/Vàng', size: '40', stock: 15 },
        { id: 5, color: 'Trắng/Xanh', size: '42', stock: 8 }
      ]
    },
    { 
      id: 3, 
      name: 'Bóng Geru Star Chính Hãng', 
      description: 'Bóng thi đấu chuyên nghiệp, đạt chuẩn FIFA', 
      category: 'Bóng đá', 
      brand: 'Geru', 
      basePrice: 450000, 
      discountPercent: 0, 
      sales: 203,
      variants: []
    },
    { 
      id: 4, 
      name: 'Áo Đấu MU 24/25 Home', 
      description: 'Bản player version, thấm hút mồ hôi tốt', 
      category: 'Áo đấu', 
      brand: 'Adidas', 
      basePrice: 1290000, 
      discountPercent: 20, 
      sales: 89,
      variants: []
    },
  ]);

  const categories = ['Giày đá bóng', 'Áo đấu', 'Quần đá bóng', 'Bóng đá', 'Găng tay thủ môn', 'Phụ kiện bóng đá'];
  const brands = ['Nike', 'Adidas', 'Puma', 'Mizuno', 'Under Armour', 'New Balance', 'Grand Sport', 'Geru'];

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterBrand, setFilterBrand] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Variant states
  const [variantModalOpen, setVariantModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingVariant, setEditingVariant] = useState(null);
  const [expandedRows, setExpandedRows] = useState({}); // mở rộng variant

  const [variantForm, setVariantForm] = useState({ color: '', size: '', stock: '' });
  const [formData, setFormData] = useState({
    name: '', description: '', category: '', brand: '', basePrice: '', discountPercent: '0'
  });

  const itemsPerPage = 6;

  useEffect(() => {
    if (!isAddModalOpen && !editingProduct) {
      setFormData({ name: '', description: '', category: '', brand: '', basePrice: '', discountPercent: '0' });
    }
  }, [isAddModalOpen, editingProduct]);

  useEffect(() => {
    if (!variantModalOpen) {
      setVariantForm({ color: '', size: '', stock: '' });
      setEditingVariant(null);
      setSelectedProduct(null);
    }
  }, [variantModalOpen]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    const matchesBrand = filterBrand === 'all' || product.brand === filterBrand;
    return matchesSearch && matchesCategory && matchesBrand;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddProduct = () => {
    const newProduct = {
      id: Date.now(),
      ...formData,
      basePrice: Number(formData.basePrice),
      discountPercent: Number(formData.discountPercent),
      sales: 0,
      variants: []
    };
    setProducts([...products, newProduct]);
    setIsAddModalOpen(false);
  };

  const handleUpdateProduct = () => {
    setProducts(products.map(p => 
      p.id === editingProduct.id 
        ? { 
            ...p, 
            ...formData, 
            basePrice: Number(formData.basePrice), 
            discountPercent: Number(formData.discountPercent)
          }
        : p
    ));
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
    setDeleteConfirm(null);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      brand: product.brand,
      basePrice: product.basePrice,
      discountPercent: product.discountPercent
    });
  };

  const openVariantModal = (product, variant = null) => {
    setSelectedProduct(product);
    if (variant) {
      setEditingVariant(variant);
      setVariantForm({
        color: variant.color,
        size: variant.size,
        stock: variant.stock
      });
    }
    setVariantModalOpen(true);
  };

  const saveVariant = () => {
    if (!variantForm.color || !variantForm.size || !variantForm.stock) return;

    const newVariant = {
      id: editingVariant?.id || Date.now(),
      color: variantForm.color,
      size: variantForm.size,
      stock: Number(variantForm.stock)
    };

    setProducts(prev => prev.map(p => 
      p.id === selectedProduct.id
        ? {
            ...p,
            variants: editingVariant
              ? p.variants.map(v => v.id === editingVariant.id ? newVariant : v)
              : [...(p.variants || []), newVariant]
          }
        : p
    ));

    setVariantModalOpen(false);
  };

  const deleteVariant = (productId, variantId) => {
    setProducts(prev => prev.map(p =>
      p.id === productId
        ? { ...p, variants: p.variants.filter(v => v.id !== variantId) }
        : p
    ));
  };

  const toggleRow = (productId) => {
    setExpandedRows(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const calculateFinalPrice = (base, discount) => {
    return base * (1 - discount / 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý sản phẩm</h1>
          <p className="text-sm text-gray-500 mt-1">Quản lý thông tin chi tiết sản phẩm và giá bán</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
        >
          <Plus className="h-5 w-5" />
          Thêm sản phẩm
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Tổng sản phẩm</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{products.length}</p>
            </div>
            <Package className="h-10 w-10 text-indigo-600" />
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Đang giảm giá</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">
                {products.filter(p => p.discountPercent > 0).length}
              </p>
            </div>
            <Tag className="h-10 w-10 text-orange-600" />
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Doanh số cao</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {products.sort((a,b) => b.sales - a.sales)[0]?.sales || 0}
              </p>
            </div>
            <ShoppingBag className="h-10 w-10 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Tổng doanh thu</p>
              <p className="text-2xl font-bold text-purple-600 mt-2">
                {formatCurrency(
                  products.reduce((sum, p) => sum + (calculateFinalPrice(p.basePrice, p.discountPercent) * p.sales), 0)
                )}
              </p>
            </div>
            <DollarSign className="h-10 w-10 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm tên sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            <option value="all">Tất cả danh mục</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={filterBrand}
            onChange={(e) => setFilterBrand(e.target.value)}
            className="px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            <option value="all">Tất cả thương hiệu</option>
            {brands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[200px] min-w-[180px]">
                  Danh mục
                </th>        
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thương hiệu</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Giá gốc</th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Giảm</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Giá bán</th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Đã bán</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedProducts.map((product) => {
                const finalPrice = calculateFinalPrice(product.basePrice, product.discountPercent);
                const isExpanded = expandedRows[product.id];

                return (
                  <React.Fragment key={product.id}>
                    <tr className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => toggleRow(product.id)}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </button>
                          <div>
                            <p className="font-medium text-gray-900">{product.name}</p>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-1">{product.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 w-[200px] min-w-[180px]">
                        <span className="px-4 py-1 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full whitespace-nowrap">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                          {product.brand}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-gray-500">
                        <del>{formatCurrency(product.basePrice)}</del>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {product.discountPercent > 0 ? (
                          <span className="px-3 py-1 text-xs font-bold bg-red-100 text-red-700 rounded-full">
                            -{product.discountPercent}%
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-gray-900">
                        {formatCurrency(finalPrice)}
                      </td>
                      <td className="px-6 py-4 text-center font-medium text-green-600">
                        {product.sales}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(product)}
                            className="p-2 hover:bg-indigo-50 rounded-lg text-indigo-600 transition"
                            title="Sửa sản phẩm"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openVariantModal(product)}
                            className="p-2 hover:bg-green-50 rounded-lg text-green-600 transition"
                            title="Thêm variant"
                          >
                            <Package2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(product)}
                            className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition"
                            title="Xóa sản phẩm"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Variant Rows */}
                    {isExpanded && product.variants?.length > 0 && (
                      <tr>
                        <td colSpan="8" className="px-6 py-4 bg-gray-50">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-700">Các biến thể (Variant)</h4>
                              <button
                                onClick={() => openVariantModal(product)}
                                className="text-sm text-indigo-600 hover:underline"
                              >
                                + Thêm variant
                              </button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                              {product.variants.map(variant => (
                                <div key={variant.id} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                                  <div>
                                    <div className="flex items-center gap-2 text-sm">
                                      <Palette className="h-4 w-4 text-gray-500" />
                                      <span className="font-medium">{variant.color}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                      <Ruler className="h-4 w-4" />
                                      <span>Size: {variant.size}</span>
                                    </div>
                                    <div className="text-sm text-gray-600 mt-1">
                                      Tồn kho: <strong className={variant.stock > 10 ? 'text-green-600' : 'text-red-600'}>
                                        {variant.stock}
                                      </strong>
                                    </div>
                                  </div>
                                  <div className="flex gap-1">
                                    <button
                                      onClick={() => openVariantModal(product, variant)}
                                      className="p-1.5 hover:bg-indigo-50 rounded text-indigo-600"
                                    >
                                      <Edit className="h-3.5 w-3.5" />
                                    </button>
                                    <button
                                      onClick={() => deleteVariant(product.id, variant.id)}
                                      className="p-1.5 hover:bg-red-50 rounded text-red-600"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center px-6 py-4 border-t border-gray-200 gap-4">
            <p className="text-sm text-gray-600">
              Trang {currentPage} / {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded-lg disabled:opacity-50"
              >
                Trước
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border rounded-lg disabled:opacity-50"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Product Modal */}
      {(isAddModalOpen || editingProduct) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
              </h2>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingProduct(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tên sản phẩm</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    placeholder="Nhập tên sản phẩm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả sản phẩm</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    placeholder="Mô tả chi tiết sản phẩm..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Thương hiệu</label>
                  <select
                    value={formData.brand}
                    onChange={(e) => setFormData({...formData, brand: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  >
                    <option value="">Chọn thương hiệu</option>
                    {brands.map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Giá gốc (VNĐ)</label>
                  <input
                    type="number"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({...formData, basePrice: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    placeholder="1000000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Giảm giá (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="90"
                    value={formData.discountPercent}
                    onChange={(e) => setFormData({...formData, discountPercent: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingProduct(null);
                  }}
                  className="px-6 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition"
                >
                  Hủy
                </button>
                <button
                  onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
                  disabled={!formData.name || !formData.category || !formData.brand || !formData.basePrice}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingProduct ? 'Cập nhật' : 'Thêm sản phẩm'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Variant Modal */}
      {variantModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {editingVariant ? 'Sửa Variant' : 'Thêm Variant Mới'}
              </h3>
              <button
                onClick={() => setVariantModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Palette className="h-4 w-4" />
                  Màu sắc
                </label>
                <input
                  type="text"
                  value={variantForm.color}
                  onChange={(e) => setVariantForm({...variantForm, color: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  placeholder="Đỏ, Trắng, Đen/Vàng..."
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Ruler className="h-4 w-4" />
                  Kích thước
                </label>
                <input
                  type="text"
                  value={variantForm.size}
                  onChange={(e) => setVariantForm({...variantForm, size: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  placeholder="M, L, XL, 40, 42..."
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Package className="h-4 w-4" />
                  Tồn kho
                </label>
                <input
                  type="number"
                  min="0"
                  value={variantForm.stock}
                  onChange={(e) => setVariantForm({...variantForm, stock: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  placeholder="50"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setVariantModalOpen(false)}
                className="px-6 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition"
              >
                Hủy
              </button>
              <button
                onClick={saveVariant}
                disabled={!variantForm.color || !variantForm.size || !variantForm.stock}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingVariant ? 'Cập nhật' : 'Thêm Variant'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
              <h3 className="text-lg font-bold text-gray-900">Xác nhận xóa</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Xóa sản phẩm <strong>"{deleteConfirm.name}"</strong>? Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-5 py-2.5 border border-gray-300 rounded-xl font-medium hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={() => handleDeleteProduct(deleteConfirm.id)}
                className="px-5 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagerContent;