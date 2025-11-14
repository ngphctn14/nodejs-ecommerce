import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import DashboardContent from '../components/DashboardContent';
import ProductManagerContent from '../components/ProductManagerContent';
import UserManagementContent from '../components/UserManagementContent';
import DiscountManagementContent from '../components/DiscountManagementContent';
import OrderManagementContent from '../components/OrderManagementContent';
export default function Mainpage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('dashboard');

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        activeMenu={activeMenu} 
        setActiveMenu={setActiveMenu} 
      />

      <div className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {activeMenu === 'dashboard' && <DashboardContent />}
            {activeMenu === 'products' && <ProductManagerContent />}
            {activeMenu === 'users' && <UserManagementContent />}
            {activeMenu === 'orders' && <OrderManagementContent />}
            {activeMenu === 'discounts' && <DiscountManagementContent />}
          </div>
        </div>
      </div>
    </div>
  );
}