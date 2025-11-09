import React, { useState } from 'react';
import { 
  TrendingUp, Users, ShoppingCart, DollarSign, Package, Calendar, 
  ChevronDown, ArrowUpRight, ArrowDownRight, Clock
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart } from 'recharts';

const DashboardContent = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [customDate, setCustomDate] = useState({ start: '', end: '' });

  const revenueData = [
    { date: '01/11', revenue: 42000000, profit: 18500000, orders: 242, products: 189 },
    { date: '05/11', revenue: 58000000, profit: 25800000, orders: 318, products: 245 },
    { date: '10/11', revenue: 72000000, profit: 32000000, orders: 401, products: 312 },
    { date: '15/11', revenue: 89000000, profit: 41200000, orders: 523, products: 398 },
    { date: '20/11', revenue: 105000000, profit: 49800000, orders: 612, products: 467 },
    { date: '25/11', revenue: 138000000, profit: 68900000, orders: 789, products: 598 },
    { date: '30/11', revenue: 165000000, profit: 82300000, orders: 912, products: 712 },
  ];

  const topProducts = [
    { rank: 1, name: 'Áo Đấu Việt Nam 2024 SEA Games', sales: 712, revenue: 712000000, growth: 32 },
    { rank: 2, name: 'Giày Adidas Predator Edge.1', sales: 598, revenue: 598000000, growth: 28 },
    { rank: 3, name: 'Áo Đấu MU 24/25 Home', sales: 523, revenue: 470700000, growth: -5 },
    { rank: 4, name: 'Bóng Đá Geru Star Chính Hãng', sales: 467, revenue: 186800000, growth: 45 },
    { rank: 5, name: 'Quần Áo Tập Luyện VN', sales: 398, revenue: 159200000, growth: 18 },
  ];

  const metrics = {
    totalUsers: 12847,
    newUsers: 842,
    totalOrders: 4912,
    totalRevenue: 165000000,
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tổng quan</h1>
          <p className="text-sm text-gray-500 mt-1">Theo dõi hiệu suất kinh doanh của Shop Bóng Đá</p>
        </div>

        <div className="flex items-center gap-3">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 bg-white"
          >
            <option value="week">Tuần này</option>
            <option value="month">Tháng này</option>
            <option value="custom">Tùy chỉnh</option>
          </select>

          {timeRange === 'custom' && (
            <div className="flex items-center gap-2">
              <input type="date" className="px-3 py-2 border rounded-lg text-sm" />
              <span className="text-gray-500">→</span>
              <input type="date" className="px-3 py-2 border rounded-lg text-sm" />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Tổng người dùng</p>
              <p className="text-3xl font-bold mt-2">{formatNumber(metrics.totalUsers)}</p>
              <p className="text-blue-100 text-xs mt-2 flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3" />
                <span>+12.5% so với tháng trước</span>
              </p>
            </div>
            <Users className="h-10 w-10 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Người dùng mới (7 ngày)</p>
              <p className="text-3xl font-bold mt-2">+{formatNumber(metrics.newUsers)}</p>
              <p className="text-green-100 text-xs mt-2 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                <span>Tăng trưởng tốt</span>
              </p>
            </div>
            <TrendingUp className="h-10 w-10 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Tổng đơn hàng</p>
              <p className="text-3xl font-bold mt-2">{formatNumber(metrics.totalOrders)}</p>
              <p className="text-purple-100 text-xs mt-2 flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3" />
                <span>+18.2% doanh số</span>
              </p>
            </div>
            <ShoppingCart className="h-10 w-10 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Doanh thu tháng</p>
              <p className="text-3xl font-bold mt-2">{formatCurrency(metrics.totalRevenue)}</p>
              <p className="text-orange-100 text-xs mt-2 flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3" />
                <span>Lợi nhuận: {formatCurrency(82300000)}</span>
              </p>
            </div>
            <DollarSign className="h-10 w-10 text-orange-200" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Doanh thu & Lợi nhuận</h3>
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Area type="monotone" dataKey="profit" stackId="1" stroke="#10b981" fill="#d1fae5" name="Lợi nhuận" />
              <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} dot={{ r: 5 }} name="Doanh thu" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Đơn hàng & Sản phẩm</h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="orders" fill="#8b5cf6" name="Đơn hàng" />
              <Bar dataKey="products" fill="#ec4899" name="Sản phẩm bán ra" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-gray-900">Top sản phẩm bán chạy</h3>
          <button className="text-indigo-600 text-sm font-medium hover:text-indigo-700">Xem tất cả →</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-500 border-b">
                <th className="pb-3">Xếp hạng</th>
                <th className="pb-3">Sản phẩm</th>
                <th className="pb-3 text-center">Đã bán</th>
                <th className="pb-3 text-right">Doanh thu</th>
                <th className="pb-3 text-right">Tăng trưởng</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {topProducts.map((product) => (
                <tr key={product.rank} className="border-b hover:bg-gray-50 transition">
                  <td className="py-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-xs">
                      {product.rank}
                    </div>
                  </td>
                  <td className="py-4 font-medium text-gray-900">{product.name}</td>
                  <td className="py-4 text-center text-gray-600">{formatNumber(product.sales)}</td>
                  <td className="py-4 text-right font-semibold text-gray-900">{formatCurrency(product.revenue)}</td>
                  <td className="py-4 text-right">
                    <span className={`flex items-center justify-end gap-1 text-xs font-medium ${product.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.growth > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {Math.abs(product.growth)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      
    </div>
  );
};

export default DashboardContent;