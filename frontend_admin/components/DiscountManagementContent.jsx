import React, { useState } from 'react';
import { 
  Search, Tag, Percent, Receipt, User, Clock, CheckCircle, XCircle, Filter
} from 'lucide-react';

const DiscountManagementContent = () => {
  const [coupons, setCoupons] = useState([
    { 
      id: 1, 
      code: 'abc23123', 
      discountPercent: 20, 
      minOrderValue: 500000, 
      status: 'unused', 
      owner: { fullName: 'Nguyễn Văn A', email: 'nguyenvana@gmail.com' },
      usedAt: null
    },
    { 
      id: 2, 
      code: 'abc2312', 
      discountPercent: 50, 
      minOrderValue: 1000000, 
      status: 'used', 
      owner: { fullName: 'Trần Thị B', email: 'tranthib@yahoo.com' },
      usedAt: '2025-07-15T10:30:00'
    },
    { 
      id: 3, 
      code: 'VIP21', 
      discountPercent: 15, 
      minOrderValue: 300000, 
      status: 'unused', 
      owner: { fullName: 'Lê Hoàng Pro', email: 'lehoang@gmail.com' },
      usedAt: null
    },
    { 
      id: 4, 
      code: 'adad212', 
      discountPercent: 10, 
      minOrderValue: 990000, 
      status: 'unused', 
      owner: { fullName: 'Phạm Văn C', email: 'phamvanc@company.com' },
      usedAt: null
    },
    { 
      id: 5, 
      code: 'adasd221', 
      discountPercent: 30, 
      minOrderValue: 2000000, 
      status: 'used', 
      owner: { fullName: 'Hoàng Thị VIP', email: 'hoangvip@temp.com' },
      usedAt: '2025-11-29T23:59:00'
    },
    { 
      id: 6, 
      code: 'adasd222', 
      discountPercent: 10, 
      minOrderValue: 0, 
      status: 'unused', 
      owner: { fullName: 'Vũ Minh Mới', email: 'vuminhnew@gmail.com' },
      usedAt: null
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;

  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch = 
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.owner.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.owner.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || coupon.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredCoupons.length / itemsPerPage);
  const paginatedCoupons = filteredCoupons.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    return date.toLocaleString('vi-VN', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    if (status === 'used') {
      return (
        <span className="px-3 py-1 text-xs font-bold bg-red-100 text-red-700 rounded-full flex items-center gap-1">
          <XCircle className="h-3.5 w-3.5" />
          Đã dùng
        </span>
      );
    }
    return (
      <span className="px-3 py-1 text-xs font-bold bg-green-100 text-green-700 rounded-full flex items-center gap-1">
        <CheckCircle className="h-3.5 w-3.5" />
        Chưa dùng
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý mã giảm giá</h1>
          <p className="text-sm text-gray-500 mt-1">Theo dõi tình trạng sử dụng mã giảm giá của người dùng</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Tổng mã giảm</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{coupons.length}</p>
            </div>
            <Tag className="h-10 w-10 text-indigo-600" />
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Chưa sử dụng</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {coupons.filter(c => c.status === 'unused').length}
              </p>
            </div>
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Đã sử dụng</p>
              <p className="text-3xl font-bold text-red-600 mt-2">
                {coupons.filter(c => c.status === 'used').length}
              </p>
            </div>
            <XCircle className="h-10 w-10 text-red-600" />
          </div>
        </div>
        
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm mã giảm hoặc người sở hữu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            <option value="all">Tất cả trạng thái</option>
            <option value="unused">Chưa dùng</option>
            <option value="used">Đã dùng</option>
          </select>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã giảm giá</th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Giảm</th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Điều kiện</th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người sở hữu</th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian dùng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedCoupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg font-bold text-sm">
                        {coupon.code}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-bold">
                      <Percent className="h-4 w-4" />
                      {coupon.discountPercent}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <Receipt className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">
                        {coupon.minOrderValue === 0 ? 'Không giới hạn' : `> ${formatCurrency(coupon.minOrderValue)}`}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {getStatusBadge(coupon.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium text-gray-900">{coupon.owner.fullName}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <User className="h-3.5 w-3.5" />
                          {coupon.owner.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-sm">
                    <div className="flex items-center justify-center gap-1 text-gray-600">
                      <Clock className="h-4 w-4" />
                      {formatDate(coupon.usedAt)}
                    </div>
                  </td>
                </tr>
              ))}
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
                className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition"
              >
                Trước
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Info Note */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <div className="bg-amber-200 rounded-full p-2">
            <Tag className="h-6 w-6 text-amber-700" />
          </div>
          <div>
            <h4 className="font-semibold text-amber-900">Lưu ý quan trọng</h4>
            <p className="text-amber-700 mt-1">
              Các mã giảm giá được hệ thống tự động cấp cho người dùng. 
              <strong> Admin không thể tạo, sửa hoặc xóa mã giảm giá từ trang này.</strong>
            </p>
            <p className="text-amber-600 text-sm mt-2">
              Mã chỉ có thể sử dụng <strong>một lần duy nhất</strong> và tự động chuyển trạng thái khi khách hàng áp dụng thành công.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscountManagementContent;