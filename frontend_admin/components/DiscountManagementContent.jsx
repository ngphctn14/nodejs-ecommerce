import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Search, Tag, Percent, Receipt, Plus, Calendar, X, Save, Copy, AlertCircle, Loader
} from 'lucide-react';

const DiscountManagementContent = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [newCode, setNewCode] = useState({
    code: '',
    discount_value: '',
    max_usage: ''
  });

  const itemsPerPage = 6;
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'; 

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/discount-codes`);
      setCoupons(response.data);
    } catch (err) {
      console.error("Lỗi lấy danh sách mã:", err);
      setError("Không thể tải dữ liệu. Vui lòng kiểm tra server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    if (!newCode.code || !newCode.discount_value || !newCode.max_usage) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    
    if (Number(newCode.discount_value) > 100) {
      alert("Giá trị giảm giá (%) không thể lớn hơn 100!");
      return;
    }

    try {
      const payload = {
        code: newCode.code.toUpperCase(),
        discount_value: Number(newCode.discount_value),
        max_usage: Number(newCode.max_usage),
        times_used: 0
      };

      await axios.post(`${API_BASE_URL}/discount-codes`, payload);

      setIsModalOpen(false);
      setNewCode({ code: '', discount_value: '', max_usage: '' });
      
      fetchCoupons();

    } catch (err) {
      console.error("Lỗi tạo mã:", err);
      const message = err.response?.data?.message || "Lỗi khi tạo mã giảm giá";
      alert(message);
    }
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('vi-VN');

  const getUsagePercentage = (used, max) => {
    if (max === 0) return 100;
    return Math.min(100, Math.round((used / max) * 100));
  };

  const filteredCoupons = coupons.filter(coupon => 
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCoupons.length / itemsPerPage);
  const paginatedCoupons = filteredCoupons.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return <div className="p-10 flex justify-center items-center text-gray-500 gap-2"><Loader className="animate-spin"/> Đang tải dữ liệu...</div>;
  if (error) return <div className="p-10 text-center text-red-500 flex flex-col items-center"><AlertCircle className="mb-2"/> {error}</div>;

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý mã giảm giá</h1>
          <p className="text-sm text-gray-500 mt-1">Dữ liệu từ hệ thống</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 font-medium"
        >
          <Plus className="h-5 w-5" /> Tạo mã mới
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">Tổng số mã</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{coupons.length}</p>
          </div>
          <div className="bg-indigo-50 p-3 rounded-full"><Tag className="h-6 w-6 text-indigo-600" /></div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">Đang hoạt động</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {coupons.filter(c => c.times_used < c.max_usage).length}
            </p>
          </div>
          <div className="bg-green-50 p-3 rounded-full"><Percent className="h-6 w-6 text-green-600" /></div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">Đã hết lượt</p>
            <p className="text-3xl font-bold text-red-600 mt-2">
              {coupons.filter(c => c.times_used >= c.max_usage).length}
            </p>
          </div>
          <div className="bg-red-50 p-3 rounded-full"><Receipt className="h-6 w-6 text-red-600" /></div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo mã code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã Code</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mức giảm</th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Lượt dùng tối đa</th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Đã sử dụng</th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Tiến độ</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedCoupons.map((coupon) => {
                const percent = getUsagePercentage(coupon.times_used, coupon.max_usage);
                const isExpired = coupon.times_used >= coupon.max_usage;

                return (
                  <tr key={coupon._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`px-3 py-1.5 rounded-lg font-bold text-sm border ${isExpired ? 'bg-gray-100 text-gray-500 border-gray-200' : 'bg-indigo-50 text-indigo-700 border-indigo-200'}`}>
                          {coupon.code}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {/* LUÔN HIỂN THỊ % */}
                      {coupon.discount_value}%
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600">
                      {coupon.max_usage}
                    </td>
                    <td className="px-6 py-4 text-center font-medium text-gray-900">
                      {coupon.times_used}
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 max-w-[100px] mx-auto">
                        <div 
                          className={`h-2.5 rounded-full ${isExpired ? 'bg-red-500' : 'bg-green-500'}`} 
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-center mt-1 text-gray-500">{percent}%</p>
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-500">
                      <div className="flex items-center justify-end gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(coupon.createdAt)}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center px-6 py-4 border-t border-gray-200 gap-4">
            <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 text-sm">Trước</button>
            <span className="text-sm text-gray-600">Trang {currentPage} / {totalPages}</span>
            <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 text-sm">Sau</button>
          </div>
        )}
      </div>

      {/* MODAL TẠO MÃ */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">Tạo mã giảm giá mới</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mã Code</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="VD: SALE20"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 uppercase"
                    value={newCode.code}
                    onChange={(e) => setNewCode({...newCode, code: e.target.value.toUpperCase()})}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mức giảm (%)</label>
                <div className="relative">
                  <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input 
                    type="number" 
                    placeholder="VD: 10, 20..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                    value={newCode.discount_value}
                    onChange={(e) => setNewCode({...newCode, discount_value: e.target.value})}
                    min="1"
                    max="100" // Giới hạn max 100%
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Nhập số phần trăm muốn giảm (1-100)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số lượt dùng tối đa</label>
                <div className="relative">
                  <Copy className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input 
                    type="number" 
                    placeholder="VD: 100"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                    value={newCode.max_usage}
                    onChange={(e) => setNewCode({...newCode, max_usage: e.target.value})}
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                >
                  <Save className="h-5 w-5" /> Lưu mã
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscountManagementContent;