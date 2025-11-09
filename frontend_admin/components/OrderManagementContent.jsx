import React, { useState } from 'react';
import { 
  Search, Package, Truck, CheckCircle, XCircle, Clock, Eye, Filter,
  Receipt, User, Calendar, ChevronDown, ChevronUp, Tag
} from 'lucide-react';

const OrderManagementContent = () => {
  const [orders, setOrders] = useState([
    {
      id: 'ORD-2025-001',
      customer: { fullName: 'Nguyễn Văn A', email: 'nguyenvana@gmail.com', phone: '0901234567' },
      items: [
        { 
          name: 'Áo Đấu Việt Nam 2024', 
          variant: { color: 'Đỏ', size: 'M' }, 
          quantity: 2, 
          price: 899000 
        },
        { 
          name: 'Giày Predator Edge.1', 
          variant: { color: 'Đen/Vàng', size: '42' }, 
          quantity: 1, 
          price: 3290000 
        }
      ],
      subtotal: 5088000,
      discountCode: 'WELCOME2025',
      discountAmount: 1017600,
      shippingFee: 30000,
      total: 4100400,
      status: 'delivered',
      createdAt: '2025-07-10T14:30:00',
      updatedAt: '2025-07-15T09:20:00',
      address: '123 Đường Láng, Đống Đa, Hà Nội'
    },
    {
      id: 'ORD-2025-002',
      customer: { fullName: 'Trần Thị B', email: 'tranthib@yahoo.com', phone: '0912345678' },
      items: [
        { 
          name: 'Bóng Geru Star', 
          variant: null, 
          quantity: 3, 
          price: 450000 
        }
      ],
      subtotal: 1350000,
      discountCode: null,
      discountAmount: 0,
      shippingFee: 0,
      total: 1350000,
      status: 'shipping',
      createdAt: '2025-08-01T10:15:00',
      updatedAt: '2025-08-02T14:00:00',
      address: '45 Nguyễn Trãi, Thanh Xuân, Hà Nội'
    },
    {
      id: 'ORD-2025-003',
      customer: { fullName: 'Lê Hoàng Pro', email: 'lehoang@gmail.com', phone: '0987654321' },
      items: [
        { 
          name: 'Áo Đấu MU 24/25 Home', 
          variant: { color: 'Đỏ', size: 'L' }, 
          quantity: 1, 
          price: 1290000 
        },
        { 
          name: 'Găng tay thủ môn Nike', 
          variant: { color: 'Xanh', size: '9' }, 
          quantity: 1, 
          price: 850000 
        }
      ],
      subtotal: 2140000,
      discountCode: 'VIP100K',
      discountAmount: 321000,
      shippingFee: 35000,
      total: 1853500,
      status: 'confirmed',
      createdAt: '2025-08-05T19:45:00',
      updatedAt: '2025-08-05T20:30:00',
      address: '789 Lê Lợi, Quận 1, TP.HCM'
    },
    {
      id: 'ORD-2025-004',
      customer: { fullName: 'Phạm Văn C', email: 'phamvanc@company.com', phone: '0934567890' },
      items: [
        { 
          name: 'Quần đá bóng Adidas', 
          variant: { color: 'Đen', size: 'XL' }, 
          quantity: 2, 
          price: 650000 
        }
      ],
      subtotal: 1300000,
      discountCode: null,
      discountAmount: 0,
      shippingFee: 40000,
      total: 1340000,
      status: 'pending',
      createdAt: '2025-08-08T08:20:00',
      updatedAt: '2025-08-08T08:20:00',
      address: '56 Trần Phú, Hải Châu, Đà Nẵng'
    },
    {
      id: 'ORD-2025-005',
      customer: { fullName: 'Hoàng Thị VIP', email: 'hoangvip@temp.com', phone: '0977123456' },
      items: [
        { 
          name: 'Bộ full combo đá bóng', 
          variant: null, 
          quantity: 1, 
          price: 5990000 
        }
      ],
      subtotal: 5990000,
      discountCode: 'BLACKFRIDAY',
      discountAmount: 1797000,
      shippingFee: 0,
      total: 4193000,
      status: 'cancelled',
      createdAt: '2025-11-29T22:10:00',
      updatedAt: '2025-11-30T09:15:00',
      address: '101 Nguyễn Huệ, Quận 1, TP.HCM'
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});

  const itemsPerPage = 6;

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
      confirmed: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-700', icon: CheckCircle },
      shipping: { label: 'Đang giao', color: 'bg-purple-100 text-purple-700', icon: Truck },
      delivered: { label: 'Đã giao', color: 'bg-green-100 text-green-700', icon: Package },
      cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-700', icon: XCircle }
    };
    return configs[status] || configs.pending;
  };

  const toggleRow = (orderId) => {
    setExpandedRows(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h1>
          <p className="text-sm text-gray-500 mt-1">Theo dõi và xem chi tiết tất cả đơn hàng</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-5">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Tổng đơn hàng</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{orders.length}</p>
            </div>
            <Receipt className="h-10 w-10 text-indigo-600" />
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Đang xử lý</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">
                {orders.filter(o => ['pending', 'confirmed'].includes(o.status)).length}
              </p>
            </div>
            <Clock className="h-10 w-10 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Đang giao</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                {orders.filter(o => o.status === 'shipping').length}
              </p>
            </div>
            <Truck className="h-10 w-10 text-purple-600" />
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Hoàn thành</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {orders.filter(o => o.status === 'delivered').length}
              </p>
            </div>
            <Package className="h-10 w-10 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Doanh thu hôm nay</p>
              <p className="text-2xl font-bold text-emerald-600 mt-2">
                {formatCurrency(orders
                  .filter(o => o.status === 'delivered' && 
                    new Date(o.createdAt).toDateString() === new Date().toDateString())
                  .reduce((sum, o) => sum + o.total, 0)
                )}
              </p>
            </div>
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
              placeholder="Tìm kiếm mã đơn, tên khách, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ xác nhận</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="shipping">Đang giao</option>
            <option value="delivered">Đã giao</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã đơn hàng</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày đặt</th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedOrders.map((order) => {
                const statusConfig = getStatusConfig(order.status);
                const StatusIcon = statusConfig.icon;
                const isExpanded = expandedRows[order.id];

                return (
                  <React.Fragment key={order.id}>
                    <tr className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="font-bold text-indigo-600">{order.id}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{order.customer.fullName}</p>
                          <p className="text-sm text-gray-500">{order.customer.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                          {order.items.length} sản phẩm
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div>
                          <p className="font-bold text-gray-900">{formatCurrency(order.total)}</p>
                          {order.discountAmount > 0 && (
                            <p className="text-xs text-green-600">−{formatCurrency(order.discountAmount)}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 text-xs font-bold rounded-full flex items-center justify-center gap-1 ${statusConfig.color}`}>
                          <StatusIcon className="h-3.5 w-3.5" />
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => toggleRow(order.id)}
                          className="p-2 hover:bg-indigo-50 rounded-lg text-indigo-600 transition"
                        >
                          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </td>
                    </tr>

                    {/* Expanded Row - Chi tiết sản phẩm + biến thể */}
                    {isExpanded && (
                      <tr>
                        <td colSpan="7" className="px-6 py-6 bg-gradient-to-r from-gray-50 to-gray-100">
                          <div className="space-y-6">
                            {/* Thông tin khách */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                  <User className="h-5 w-5" /> Thông tin khách hàng
                                </h4>
                                <div className="bg-white rounded-xl p-4 space-y-2">
                                  <p><strong>Họ tên:</strong> {order.customer.fullName}</p>
                                  <p><strong>Email:</strong> {order.customer.email}</p>
                                  <p><strong>SĐT:</strong> {order.customer.phone}</p>
                                  <p><strong>Địa chỉ:</strong> {order.address}</p>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                  <Receipt className="h-5 w-5" /> Thanh toán & vận chuyển
                                </h4>
                                <div className="bg-white rounded-xl p-4 space-y-2">
                                  <p><strong>Mã giảm giá:</strong> {order.discountCode ? 
                                    <span className="text-green-600 font-bold">{order.discountCode}</span> : 
                                    <span className="text-gray-400">Không sử dụng</span>}
                                  </p>
                                  <p><strong>Phí ship:</strong> {formatCurrency(order.shippingFee)}</p>
                                  <p><strong>Tổng cộng:</strong> 
                                    <span className="text-2xl font-bold text-indigo-600 ml-2">
                                      {formatCurrency(order.total)}
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Danh sách sản phẩm + biến thể */}
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Package className="h-5 w-5" /> Chi tiết sản phẩm
                              </h4>
                              <div className="space-y-3">
                                {order.items.map((item, idx) => (
                                  <div key={idx} className="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between">
                                    <div className="flex-1">
                                      <p className="font-semibold text-gray-900 text-lg">{item.name}</p>
                                      {item.variant ? (
                                        <div className="flex items-center gap-4 mt-2">
                                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm">
                                            Màu: {item.variant.color}
                                          </span>
                                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-sm">
                                            Size: {item.variant.size}
                                          </span>
                                        </div>
                                      ) : (
                                        <span className="text-sm text-gray-500 italic">Không có biến thể</span>
                                      )}
                                    </div>
                                    <div className="text-right">
                                      <p className="text-sm text-gray-600">Số lượng: <strong>{item.quantity}</strong></p>
                                      <p className="font-bold text-gray-900 mt-1">
                                        {formatCurrency(item.price * item.quantity)}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Timeline trạng thái */}
                            <div className="border-t pt-4">
                              <p className="text-sm text-gray-600">
                                Cập nhật lần cuối: <strong>{formatDate(order.updatedAt)}</strong>
                              </p>
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
    </div>
  );
};

export default OrderManagementContent;