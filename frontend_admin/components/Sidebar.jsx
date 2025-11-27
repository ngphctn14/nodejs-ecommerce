import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Package, Users, ShoppingCart, Tag, Menu, X, LogOut, Shirt
} from 'lucide-react';

export default function Sidebar({ isOpen, setIsOpen, activeMenu, setActiveMenu }) {
  const navigate = useNavigate(); 
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Tổng quan hệ thống' },
    { id: 'products', label: 'Product Management', icon: Package, description: 'Quản lý sản phẩm' },
    { id: 'users', label: 'User Management', icon: Users, description: 'Quản lý người dùng' },
    { id: 'orders', label: 'Order List', icon: ShoppingCart, description: 'Danh sách đơn hàng' },
    { id: 'discounts', label: 'Discount Management', icon: Tag, description: 'Quản lý mã giảm giá' },
  ];

  const handleMenuClick = (menuId) => {
    setActiveMenu(menuId);
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Bạn có chắc chắn muốn đăng xuất?");
    if (!confirmLogout) return;

    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');

    navigate('/login');
  };

  return (
    <div className={`${isOpen ? 'w-72' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col shadow-sm`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {isOpen && (
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 rounded-xl shadow-lg">
              <Shirt className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-gray-900">Shop Bóng Đá</h2>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </div>
        )}
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 hover:bg-gray-100 rounded-lg">
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <nav className="flex-1 py-4 px-3">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleMenuClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all group ${
                  activeMenu === item.id
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
                title={!isOpen ? item.label : ''}
              >
                <item.icon className={`h-5 w-5 ${activeMenu === item.id ? 'text-white' : 'text-gray-500'}`} />
                {isOpen && (
                  <div className="flex-1 text-left">
                    <span className="font-medium text-sm block">{item.label}</span>
                    <span className={`text-xs ${activeMenu === item.id ? 'text-indigo-100' : 'text-gray-500'}`}>
                      {item.description}
                    </span>
                  </div>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-gray-200 p-4">
        {isOpen ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3 px-3 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">AD</div>
              <div>
                <p className="font-semibold text-sm">Admin User</p>
              </div>
            </div>
            
            <button 
              onClick={handleLogout} 
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 rounded-xl text-red-600 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium text-sm">Đăng xuất</span>
            </button>

          </div>
        ) : (
          <button
            onClick={handleLogout}
            className="w-full p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors" 
            title="Đăng xuất"
          >
            <LogOut className="h-6 w-6 mx-auto" />
          </button>
        )}
      </div>
    </div>
  );
}