import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { 
  Search, Package, Truck, CheckCircle, XCircle, Clock, Eye, 
  Receipt, User, ChevronUp, RefreshCw, AlertCircle, Coins
} from 'lucide-react';

const OrderManagementContent = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState({});

  const itemsPerPage = 6;
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'; 

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/orders`);
        setOrders(response.data);
      } catch (err) {
        console.error("Lỗi tải đơn hàng:", err);
        setError("Không thể kết nối đến server. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    const oldOrders = [...orders];
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );

    try {
      await axios.put(`${API_BASE_URL}/orders/${orderId}/status`, { status: newStatus });
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái:", err);
      alert("Cập nhật thất bại! Đang hoàn tác...");
      setOrders(oldOrders); 
    }
  };

  const handlePaymentStatusChange = async (orderId, newPaymentStatus) => {
    const oldOrders = [...orders];
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, paymentStatus: newPaymentStatus } : order
      )
    );

    try {
      await axios.put(`${API_BASE_URL}/orders/${orderId}/status`, { paymentStatus: newPaymentStatus });
    } catch (err) {
      console.error("Lỗi cập nhật thanh toán:", err);
      alert("Cập nhật thất bại! Đang hoàn tác...");
      setOrders(oldOrders);
    }
  };

  const ORDER_STATUS_CONFIG = {
    pending: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock },
    confirmed: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: CheckCircle },
    shipping: { label: 'Đang giao', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: Truck },
    delivered: { label: 'Đã giao', color: 'bg-green-100 text-green-700 border-green-200', icon: Package },
    cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle }
  };

  const PAYMENT_STATUS_CONFIG = {
    unpaid: { label: 'Chưa thanh toán', color: 'bg-gray-100 text-gray-700 border-gray-200' },
    paid: { label: 'Đã thanh toán', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    refunded: { label: 'Đã hoàn tiền', color: 'bg-rose-100 text-rose-700 border-rose-200' }
  };

  const filteredOrders = orders.filter(order => {
    const term = searchTerm.toLowerCase();
    const orderId = order.id ? order.id.toString().toLowerCase() : '';
    const customerName = order.customer?.fullName?.toLowerCase() || '';
    const customerEmail = order.customer?.email?.toLowerCase() || '';

    const matchesSearch = 
      orderId.includes(term) || customerName.includes(term) || customerEmail.includes(term);
    
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  const formatDate = (dateStr) => new Date(dateStr).toLocaleString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  const toggleRow = (orderId) => setExpandedRows(prev => ({ ...prev, [orderId]: !prev[orderId] }));

  if (loading) return <div className="p-10 text-center text-gray-500">Đang tải dữ liệu đơn hàng...</div>;
  if (error) return <div className="p-10 text-center text-red-500 flex flex-col items-center"><AlertCircle className="mb-2"/> {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h1>
          <p className="text-sm text-gray-500 mt-1">Dữ liệu thực tế từ hệ thống</p>
        </div>
      </div>

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
            {Object.keys(ORDER_STATUS_CONFIG).map(key => (
              <option key={key} value={key}>{ORDER_STATUS_CONFIG[key].label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã đơn</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">SL</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái & TT</th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày đặt</th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedOrders.map((order) => {
                const statusInfo = ORDER_STATUS_CONFIG[order.status] || ORDER_STATUS_CONFIG.pending;
                const paymentInfo = PAYMENT_STATUS_CONFIG[order.paymentStatus] || PAYMENT_STATUS_CONFIG.unpaid;
                const StatusIcon = statusInfo.icon;
                const isExpanded = expandedRows[order.id];

                return (
                  <React.Fragment key={order.id}>
                    <tr className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-bold text-indigo-600 text-sm">
                        #{order.id.slice(-6).toUpperCase()}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{order.customer.fullName}</p>
                          <p className="text-xs text-gray-500">{order.customer.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                          {order.items.length}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{formatCurrency(order.total)}</p>
                          {order.discountAmount > 0 && (
                            <p className="text-xs text-green-600">−{formatCurrency(order.discountAmount)}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1 items-center">
                          <span className={`w-fit px-2 py-0.5 text-[10px] font-bold rounded-full flex items-center justify-center gap-1 border ${statusInfo.color}`}>
                            <StatusIcon className="h-3 w-3" />
                            {statusInfo.label}
                          </span>
                          <span className={`w-fit px-2 py-0.5 text-[10px] font-semibold rounded-full border ${paymentInfo.color}`}>
                            {paymentInfo.label}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center text-xs text-gray-600">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button onClick={() => toggleRow(order.id)} className="p-1 hover:bg-indigo-50 rounded text-indigo-600 transition">
                          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </td>
                    </tr>

                    {/* --- EXPANDED ROW --- */}
                    {isExpanded && (
                      <tr>
                        <td colSpan="7" className="px-6 py-6 bg-gray-50 border-b border-gray-200">
                          <div className="space-y-6">
                            
                            {/* KHU VỰC CẬP NHẬT TRẠNG THÁI */}
                            <div className="bg-white rounded-lg p-4 border border-indigo-100 shadow-sm">
                              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm">
                                <RefreshCw className="h-4 w-4 text-indigo-600" /> Cập nhật trạng thái
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">Trạng thái đơn hàng</label>
                                  <select 
                                    value={order.status}
                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                    className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 bg-gray-50"
                                  >
                                    {Object.keys(ORDER_STATUS_CONFIG).map(key => (
                                      <option key={key} value={key}>{ORDER_STATUS_CONFIG[key].label}</option>
                                    ))}
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">Trạng thái thanh toán</label>
                                  <select 
                                    value={order.paymentStatus}
                                    onChange={(e) => handlePaymentStatusChange(order.id, e.target.value)}
                                    className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 bg-gray-50"
                                  >
                                     {Object.keys(PAYMENT_STATUS_CONFIG).map(key => (
                                      <option key={key} value={key}>{PAYMENT_STATUS_CONFIG[key].label}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2 text-sm"><User className="h-4 w-4" /> Khách hàng</h4>
                                <div className="bg-white rounded-lg p-3 space-y-1 border border-gray-200 text-sm">
                                  <p><strong>Họ tên:</strong> {order.customer.fullName}</p>
                                  <p><strong>Email:</strong> {order.customer.email}</p>
                                  <p><strong>SĐT:</strong> {order.customer.phone || 'N/A'}</p>
                                  <p><strong>Địa chỉ:</strong> {order.address}</p>
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2 text-sm"><Receipt className="h-4 w-4" /> Thanh toán & Ưu đãi</h4>
                                <div className="bg-white rounded-lg p-3 space-y-1 border border-gray-200 text-sm">
                                  <p className="flex justify-between">
                                    <span>Tạm tính:</span>
                                    <span>{formatCurrency(order.subtotal)}</span>
                                  </p>
                                  
                                  <div className="border-t border-dashed my-2 pt-2 space-y-1">
                                    <p className="flex justify-between items-center">
                                      <span>Mã giảm giá: {order.discountCode ? <span className="font-bold text-indigo-600">{order.discountCode}</span> : 'Không'}</span>
                                      {/* Hiển thị giá trị voucher nếu có */}
                                      {order.discountValue > 0 && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">-{order.discountValue}</span>}
                                    </p>
                                    
                                    {order.discountAmount > 0 && (
                                      <p className="flex justify-between text-green-600">
                                        <span>Tổng giảm giá:</span>
                                        <span>-{formatCurrency(order.discountAmount)}</span>
                                      </p>
                                    )}

                                    {/* --- HIỂN THỊ ĐIỂM LOYALTY --- */}
                                    {order.loyaltyPointsUsed > 0 && (
                                      <p className="flex justify-between text-orange-600">
                                        <span className="flex items-center gap-1"><Coins className="h-3 w-3"/> Điểm đã dùng:</span>
                                        <span>-{order.loyaltyPointsUsed} điểm</span>
                                      </p>
                                    )}
                                    {order.loyaltyPointsEarned > 0 && (
                                      <p className="flex justify-between text-emerald-600">
                                        <span className="flex items-center gap-1"><Coins className="h-3 w-3"/> Điểm tích lũy:</span>
                                        <span>+{order.loyaltyPointsEarned} điểm</span>
                                      </p>
                                    )}
                                    {/* ----------------------------- */}
                                  </div>

                                  <div className="border-t pt-2 mt-2 flex justify-between items-center">
                                    <span className="font-bold text-gray-900">Tổng thanh toán:</span>
                                    <span className="text-lg font-bold text-indigo-600">{formatCurrency(order.total)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* DANH SÁCH SẢN PHẨM */}
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2 text-sm"><Package className="h-4 w-4" /> Sản phẩm</h4>
                              <div className="space-y-2">
                                {order.items.map((item, idx) => (
                                  <div key={idx} className="bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-between">
                                    <div className="flex-1">
                                      <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                                      {item.variant ? (
                                        <div className="flex gap-2 mt-1">
                                          <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">Màu: {item.variant.color}</span>
                                          <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">Size: {item.variant.size}</span>
                                        </div>
                                      ) : <span className="text-xs text-gray-400 italic">Cơ bản</span>}
                                    </div>
                                    <div className="text-right text-sm">
                                      <span className="text-gray-500">x{item.quantity}</span>
                                      <p className="font-semibold">{formatCurrency(item.price)}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
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
            <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 text-sm">Trước</button>
            <span className="text-sm text-gray-600">Trang {currentPage} / {totalPages}</span>
            <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 text-sm">Sau</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagementContent;