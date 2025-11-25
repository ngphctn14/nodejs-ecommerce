import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  TrendingUp, Users, ShoppingCart, DollarSign
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, ComposedChart 
} from 'recharts';

const DashboardContent = () => {
  const getCurrentMonthValue = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  };

  const [timeRange, setTimeRange] = useState(getCurrentMonthValue());
  const [loading, setLoading] = useState(true);

  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    newUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [revenueData, setRevenueData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  const API_BASE_URL = import.meta.env.VITE_API_URL;;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        const [year, month] = timeRange.split('-');

        const [metricsRes, chartRes, topProductsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/dashboard/metrics`), 
          
          axios.get(`${API_BASE_URL}/dashboard/revenue-chart`, {
            params: { month, year }
          }),

          axios.get(`${API_BASE_URL}/dashboard/topselling`) 
        ]);

        setMetrics(metricsRes.data);
        setRevenueData(chartRes.data);
        setTopProducts(topProductsRes.data);

      } catch (error) {
        console.error("Lỗi tải dữ liệu dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [timeRange]); 

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  if (loading && !metrics.totalUsers && revenueData.length === 0) {
    return <div className="p-10 text-center text-gray-500">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tổng quan</h1>
          <p className="text-sm text-gray-500 mt-1">Theo dõi hiệu suất kinh doanh của Shop Bóng Đá</p>
        </div>
      </div>

      {/* --- PHẦN METRICS (Dữ liệu từ API 1) --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Tổng người dùng</p>
              <p className="text-3xl font-bold mt-2">{formatNumber(metrics.totalUsers)}</p>
            </div>
            <Users className="h-10 w-10 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Người dùng mới (Tháng này)</p>
              <p className="text-3xl font-bold mt-2">+{formatNumber(metrics.newUsers)}</p>
            </div>
            <TrendingUp className="h-10 w-10 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Tổng đơn hàng</p>
              <p className="text-3xl font-bold mt-2">{formatNumber(metrics.totalOrders)}</p>
            </div>
            <ShoppingCart className="h-10 w-10 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Doanh thu tổng</p>
              <p className="text-3xl font-bold mt-2">{formatCurrency(metrics.totalRevenue)}</p>
            </div>
            <DollarSign className="h-10 w-10 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Bộ lọc thời gian cho biểu đồ */}
      <div className="flex items-center gap-3">
        <input
          type="month"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="ml-auto px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 bg-white"
        />
      </div>

      {/* --- PHẦN BIỂU ĐỒ (Dữ liệu từ API 2) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Doanh thu & Lợi nhuận</h3>
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Area 
                type="monotone" 
                dataKey="profit" 
                stackId="1" 
                stroke="#10b981" 
                fill="#d1fae5" 
                name="Lợi nhuận" 
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#6366f1" 
                strokeWidth={3} 
                dot={{ r: 5 }} 
                name="Doanh thu" 
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Đơn hàng & Sản phẩm</h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="orders" fill="#8b5cf6" name="Đơn hàng" />
              <Bar dataKey="products" fill="#ec4899" name="Sản phẩm" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* --- PHẦN TOP SẢN PHẨM (Dữ liệu từ API 3) --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-gray-900">Top sản phẩm bán chạy</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-500 border-b">
                <th className="pb-3">Xếp hạng</th>
                <th className="pb-3">Sản phẩm</th>
                <th className="pb-3 text-center">Đã bán</th>
                <th className="pb-3 text-right">Doanh thu</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {topProducts.length > 0 ? (
                topProducts.map((product) => (
                  <tr key={product.rank} className="border-b hover:bg-gray-50 transition">
                    <td className="py-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-xs">
                        {product.rank}
                      </div>
                    </td>
                    <td className="py-4 font-medium text-gray-900">{product.name}</td>
                    <td className="py-4 text-center text-gray-600">
                      {formatNumber(product.sales)}
                    </td>
                    <td className="py-4 text-right font-semibold text-gray-900">
                      {formatCurrency(product.revenue)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-4 text-center text-gray-500">Chưa có dữ liệu</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;