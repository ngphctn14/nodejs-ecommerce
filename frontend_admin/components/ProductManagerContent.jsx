import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Edit, Trash2, AlertCircle, X, DollarSign, Tag, ShoppingBag, Package,
  Package2, Palette, Ruler, ChevronDown, ChevronUp, Image as ImageIcon, Barcode
} from 'lucide-react';
import axios from 'axios'

const ProductManagerContent = () => {
  const API_BASE_URL = import.meta.env.VITE_API_URL;;

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        const [productRes, cateRes, brandRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/products`), 
          axios.get(`${API_BASE_URL}/categories`),                         
          axios.get(`${API_BASE_URL}/brands`) 
        ]);

        const productsData = productRes.data;
        
        // Lấy variants (Giữ nguyên logic cũ)
        const productsWithVariants = await Promise.all(
          productsData.map(async (product) => {
            try {
              const variantRes = await axios.get(`${API_BASE_URL}/products/${product._id}/variants`);
              const formattedVariants = variantRes.data.map(v => ({
                ...v,
                color: v.attributes?.color || v.color, 
                size: v.attributes?.size || v.size,
                id: v._id 
              }));
              return { ...product, variants: formattedVariants };
            } catch (err) {
              return { ...product, variants: [] };
            }
          })
        );

        setProducts(productsWithVariants);
        setCategories(cateRes.data);
        setBrands(brandRes.data);

      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      } finally {
        setIsLoading(false);
      }
    }
    getData()
  }, [])

  // --- State quản lý UI ---
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterBrand, setFilterBrand] = useState('all');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // --- State Variant ---
  const [variantModalOpen, setVariantModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingVariant, setEditingVariant] = useState(null);
  const [expandedRows, setExpandedRows] = useState({}); 
  const [variantForm, setVariantForm] = useState({ sku: '', price: '', color: '', size: '', stock: '' });
  
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);
  const [newImageUrl, setNewImageUrl] = useState(''); 

  // --- State Form ---
  const [formData, setFormData] = useState({
    name: '', 
    description: '', 
    categoryId: '', 
    brandId: '',    
    basePrice: '', 
    discountPercent: '0',
    imageUrl: ''
  });

  const itemsPerPage = 6;

  useEffect(() => {
    if (!isAddModalOpen && !editingProduct) {
      setFormData({ name: '', description: '', categoryId: '', brandId: '', basePrice: '', discountPercent: '0', imageUrl: '' });
    }
  }, [isAddModalOpen, editingProduct]);

  // Reset Image Modal State
  useEffect(() => {
    if (!imageModalOpen) {
      setNewImageUrl('');
      setCurrentImages([]);
      setSelectedProduct(null);
    }
  }, [imageModalOpen]);

  // Reset variant form modal
  useEffect(() => {
    if (!variantModalOpen) {
      setVariantForm({ sku: '', price: '', color: '', size: '', stock: '' });
      setEditingVariant(null);
      setSelectedProduct(null);
    }
  }, [variantModalOpen]);

  // --- Filter Logic ---
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.categoryId === filterCategory;
    const matchesBrand = filterBrand === 'all' || product.brandId === filterBrand;
    return matchesSearch && matchesCategory && matchesBrand;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getCategoryName = (id) => {
    const cat = categories.find(c => c._id === id);
    return cat ? cat.name : "N/A";
  }

  const getBrandName = (id) => {
    const brand = brands.find(b => b._id === id);
    return brand ? brand.name : "N/A";
  }

  // --- CRUD Handlers ---
  const handleAddProduct = async () => {
    try {
      const payload = {
        ...formData,
        basePrice: Number(formData.basePrice),
        discountPercent: Number(formData.discountPercent),
        sales: 0,
      };

      const response = await axios.post(`${API_BASE_URL}/products`, payload);
      const newProduct = response.data;
      setProducts([{ ...newProduct, variants: [] }, ...products]);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error);
      alert("Không thể thêm sản phẩm. Vui lòng kiểm tra lại thông tin!");
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;

    try {
      const payload = {
        ...formData,
        basePrice: Number(formData.basePrice),
        discountPercent: Number(formData.discountPercent),
      };

      const response = await axios.put(`${API_BASE_URL}/products/${editingProduct._id}`, payload);
      const updatedProduct = response.data;

      setProducts(products.map(p => 
        p._id === editingProduct._id
          ? { 
              ...updatedProduct, 
              variants: p.variants 
            }
          : p
      ));

      setEditingProduct(null);
      setIsAddModalOpen(false); 
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error);
      alert("Không thể cập nhật sản phẩm. Vui lòng thử lại!");
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/products/${id}`);

      setProducts(products.filter(p => p._id !== id));
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      alert("Không thể xóa sản phẩm. Có thể sản phẩm đang có đơn hàng hoặc lỗi server.");
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      categoryId: product.categoryId, 
      brandId: product.brandId,       
      basePrice: product.basePrice,
      discountPercent: product.discountPercent,
      imageUrl: product.imageUrl || ''
    });
    setIsAddModalOpen(true); 
  };

  const openImageModal = async (product) => {
    setSelectedProduct(product);
    setImageModalOpen(true);
    
    try {
      const res = await axios.get(`${API_BASE_URL}/products/${product._id}/images`);
      setCurrentImages(res.data); 
    } catch (error) {
      console.warn("Chưa load được danh sách ảnh chi tiết, hiển thị ảnh mặc định.");
      if (product.imageUrl) {
        setCurrentImages([{ _id: 'default', url: product.imageUrl }]);
      } else {
        setCurrentImages([]);
      }
    }
  };

  const handleAddImage = async () => {
    if (!newImageUrl || !selectedProduct) return;

    try {
      const payload = { url: newImageUrl,
        productId: selectedProduct._id,
        alt: selectedProduct.name + "- ảnh"
       };
      const res = await axios.post(`${API_BASE_URL}/product-images/`, payload);
      
      setCurrentImages([...currentImages, res.data]); 
      setNewImageUrl('');
    } catch (error) {
      console.error("Lỗi thêm ảnh:", error);
      const mockImage = { _id: Date.now(), url: newImageUrl };
      setCurrentImages([...currentImages, mockImage]);
      setNewImageUrl('');
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!selectedProduct) return;
    if (!window.confirm("Bạn chắc chắn muốn xóa ảnh này?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/product-images/${imageId}`);
      
      setCurrentImages(currentImages.filter(img => img._id !== imageId));
    } catch (error) {
      console.error("Lỗi xóa ảnh:", error);
      setCurrentImages(currentImages.filter(img => img._id !== imageId));
    }
  };

  const generateRandomSKU = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 10; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const openVariantModal = (product, variant = null) => {
    setSelectedProduct(product);
    if (variant) {
      setEditingVariant(variant);
      setVariantForm({
        sku: variant.sku || '',
        price: variant.price || 0,
        color: variant.color || '', 
        size: variant.size || '',
        stock: variant.stock || 0
      });
    } else {
      const discount = product.discountPercent || 0;
      const calculatedPrice = Math.round(product.basePrice * (1 - discount / 100));
      
      setVariantForm({
        sku: generateRandomSKU(), 
        price: calculatedPrice,  
        color: '',
        size: '',
        stock: 0                  
      });
      setEditingVariant(null);
    }
    setVariantModalOpen(true);
  };

  const saveVariant = async () => {
    if (!variantForm.sku || !variantForm.color || !variantForm.size || variantForm.stock === '' || !variantForm.price) {
      alert("Vui lòng điền đầy đủ SKU, Giá, Màu, Size và Tồn kho");
      return;
    }

    const payload = {
      productId: selectedProduct._id,
      sku: variantForm.sku,
      price: Number(variantForm.price),
      stock: Number(variantForm.stock),
      attributes: {
        color: variantForm.color,
        size: variantForm.size
      }
    };

    try {
      let savedVariant;
      
      if (editingVariant) {
        const res = await axios.put(
          `${API_BASE_URL}/product-variants/${editingVariant.id}`, 
          payload
        );
        savedVariant = res.data;
      } else {
        const res = await axios.post(
          `${API_BASE_URL}/product-variants`, 
          payload
        );
        savedVariant = res.data;
      }

      const formattedVariant = {
        ...savedVariant,
        color: savedVariant.attributes?.color || savedVariant.color,
        size: savedVariant.attributes?.size || savedVariant.size,
        id: savedVariant._id 
      };

      setProducts(prev => prev.map(p => 
        p._id === selectedProduct._id
          ? {
              ...p,
              variants: editingVariant
                ? p.variants.map(v => v.id === editingVariant.id ? formattedVariant : v)
                : [...(p.variants || []), formattedVariant]
            }
          : p
      ));

      setVariantModalOpen(false);

    } catch (error) {
      console.error("Lỗi lưu variant:", error);
      const msg = error.response?.data?.message || error.message;
      alert(`Không thể lưu biến thể: ${msg}`);
    }
  };

  const deleteVariant = async (productId, variantId) => {
    if(!window.confirm("Bạn có chắc muốn xóa biến thể này không?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/product-variants/${variantId}`);

      setProducts(prev => prev.map(p =>
        p._id === productId
          ? { ...p, variants: (p.variants || []).filter(v => v.id !== variantId) }
          : p
      ));
    } catch (error) {
      console.error("Lỗi xóa variant:", error);
      alert("Không thể xóa biến thể. Vui lòng thử lại.");
    }
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Stats (Giữ nguyên) */}
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
                {products.length > 0 ? (products.sort((a,b) => b.sales - a.sales)[0]?.sales || 0) : 0}
              </p>
            </div>
            <ShoppingBag className="h-10 w-10 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Tổng doanh thu (Ước tính)</p>
              <p className="text-2xl font-bold text-purple-600 mt-2">
                {formatCurrency(
                  products.reduce((sum, p) => sum + (calculateFinalPrice(p.basePrice, p.discountPercent) * (p.sales || 0)), 0)
                )}
              </p>
            </div>
            <DollarSign className="h-10 w-10 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Search & Filters (Giữ nguyên) */}
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
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
          <select
            value={filterBrand}
            onChange={(e) => setFilterBrand(e.target.value)}
            className="px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            <option value="all">Tất cả thương hiệu</option>
            {brands.map(brand => (
              <option key={brand._id} value={brand._id}>
                {brand.name}
              </option>
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
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[200px] min-w-[180px]">Danh mục</th>        
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
                const isExpanded = expandedRows[product._id];

                return (
                  <React.Fragment key={product._id}>
                    <tr className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => toggleRow(product._id)}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </button>
                          <div>
                            <p className="font-medium text-gray-900">{product.name}</p>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-1">{product.description}</p>
                            <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                               {product.variants?.length || 0} variants
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 w-[200px] min-w-[180px]">
                        <span className="px-4 py-1 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full whitespace-nowrap">
                          {getCategoryName(product.categoryId)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span 
                          className="px-3 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full truncate max-w-[120px] inline-block align-middle"
                          title={getBrandName(product.brandId)} 
                        >
                          {getBrandName(product.brandId)}
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
                            onClick={() => openImageModal(product)}
                            className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition"
                            title="Quản lý hình ảnh"
                          >
                            <ImageIcon className="h-4 w-4" />
                          </button>
                          
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
                    {isExpanded && product.variants && product.variants.length > 0 ? (
                      <tr>
                        <td colSpan="8" className="px-6 py-4 bg-gray-50">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-700">Các biến thể (Variant) - {product.variants.length} item(s)</h4>
                              <button
                                onClick={() => openVariantModal(product)}
                                className="text-sm text-indigo-600 hover:underline"
                              >
                                + Thêm variant
                              </button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                              {product.variants.map(variant => (
                                <div key={variant.id || variant._id} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between shadow-sm">
                                   <div className="flex-1">
                                     <div className="flex items-center gap-2 text-sm font-semibold text-indigo-700 mb-1">
                                       <Barcode className="h-4 w-4" /> SKU: {variant.sku}
                                     </div>
                                     <div className="flex items-center gap-2 text-sm">
                                       <Palette className="h-4 w-4 text-gray-500" />
                                       <span className="font-medium">Màu: {variant.color}</span>
                                     </div>
                                     <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                       <Ruler className="h-4 w-4" />
                                       <span>Size: {variant.size}</span>
                                     </div>
                                     <div className="flex justify-between items-center mt-2">
                                        <div className="text-sm text-gray-600">
                                          Tồn kho: <strong className={variant.stock > 10 ? 'text-green-600' : 'text-red-600'}>{variant.stock}</strong>
                                        </div>
                                        <div className="text-sm font-bold text-gray-800">
                                          {formatCurrency(variant.price)}
                                        </div>
                                     </div>
                                   </div>
                                   <div className="flex flex-col gap-1 ml-4">
                                     <button
                                        onClick={() => openVariantModal(product, variant)}
                                        className="p-1.5 hover:bg-indigo-50 rounded text-indigo-600"
                                        title="Sửa variant"
                                      >
                                        <Edit className="h-3.5 w-3.5" />
                                      </button>
                                      <button
                                        onClick={() => deleteVariant(product._id, variant.id || variant._id)}
                                        className="p-1.5 hover:bg-red-50 rounded text-red-600"
                                        title="Xóa variant"
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
                    ) : isExpanded ? (
                        <tr>
                            <td colSpan="8" className="px-6 py-4 bg-gray-50 text-center text-gray-500">
                                Chưa có biến thể nào. <button onClick={() => openVariantModal(product)} className="text-indigo-600 hover:underline">Thêm ngay</button>
                            </td>
                        </tr>
                    ) : null}
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

      {/* Add/Edit Product Modal (Giữ nguyên) */}
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
                    value={formData.categoryId}
                    onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Thương hiệu</label>
                  <select
                    value={formData.brandId}
                    onChange={(e) => setFormData({...formData, brandId: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  >
                    <option value="">Chọn thương hiệu</option>
                    {brands.map(brand => (
                      <option key={brand._id} value={brand._id}>{brand.name}</option>
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
                  disabled={!formData.name || !formData.categoryId || !formData.brandId || !formData.basePrice}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingProduct ? 'Cập nhật' : 'Thêm sản phẩm'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal (Giữ nguyên) */}
      {imageModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <ImageIcon className="h-6 w-6 text-blue-600" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Quản lý hình ảnh</h3>
                  <p className="text-sm text-gray-500">{selectedProduct.name}</p>
                </div>
              </div>
              <button
                onClick={() => setImageModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
              {currentImages.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {currentImages.map((img, idx) => (
                    <div key={img._id || idx} className="group relative aspect-square bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
                      <img 
                        src={img.url} 
                        alt="Product" 
                        className="w-full h-full object-contain" 
                        onError={(e) => e.target.src = 'https://via.placeholder.com/150?text=No+Image'}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <button
                          onClick={() => handleDeleteImage(img._id)}
                          className="p-2 bg-white text-red-600 rounded-full hover:bg-red-50 transform hover:scale-110 transition"
                          title="Xóa ảnh"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                  <ImageIcon className="h-12 w-12 mb-2 opacity-20" />
                  <p>Chưa có hình ảnh nào</p>
                </div>
              )}
            </div>

            <div className="space-y-3 pt-4 border-t border-gray-200">
              <label className="text-sm font-medium text-gray-700">Thêm ảnh mới (URL)</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <button
                  onClick={handleAddImage}
                  disabled={!newImageUrl}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Thêm
                </button>
              </div>
              <p className="text-xs text-gray-500">
                * Nhập đường dẫn hình ảnh (URL) từ internet.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* --- VARIANT MODAL (ĐÃ CẬP NHẬT) --- */}
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
              {/* SKU & Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Barcode className="h-4 w-4" />
                    Mã SKU
                  </label>
                  <input
                    type="text"
                    value={variantForm.sku}
                    onChange={(e) => setVariantForm({...variantForm, sku: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    placeholder="SKU-001"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="h-4 w-4" />
                    Giá bán
                  </label>
                  <input
                    type="number"
                    value={variantForm.price}
                    onChange={(e) => setVariantForm({...variantForm, price: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    placeholder="100000"
                  />
                </div>
              </div>

              {/* Color & Size */}
              <div className="grid grid-cols-2 gap-4">
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
                    placeholder="Đỏ..."
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
                    placeholder="XL..."
                  />
                </div>
              </div>

              {/* Stock */}
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
                disabled={!variantForm.color || !variantForm.size || !variantForm.stock || !variantForm.sku || !variantForm.price}
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
                onClick={() => handleDeleteProduct(deleteConfirm._id)}
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