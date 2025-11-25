import React, { useState, useEffect } from 'react';
import { 
  Search, Edit, Ban, UserCheck, AlertCircle, X, Shield, Mail, 
  CheckCircle, XCircle, Globe, Facebook, Chrome, Star, ArrowUpDown
} from 'lucide-react';
import axios from 'axios';

const UserManagementContent = () => {
  // Use the environment variable correctly
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterVerified, setFilterVerified] = useState('all');
  const [filterProvider, setFilterProvider] = useState('all');
   
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [banConfirm, setBanConfirm] = useState(null);

  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc'); 

  const [formData, setFormData] = useState({
    fullName: '', email: '', role: 'user'
  });

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${API_BASE_URL}/users`);
      
      // 🔽 FIX: Ensure response data is an array before setting state
      if (Array.isArray(res.data)) {
        setUsers(res.data);
      } else if (res.data && Array.isArray(res.data.users)) {
        // Handle case where API returns { users: [...] }
        setUsers(res.data.users);
      } else {
        console.warn("API did not return an array of users:", res.data);
        setUsers([]);
      }

    } catch (error) {
      console.error("Lỗi lấy danh sách người dùng:", error);
      setUsers([]); // Set to empty array on error to prevent crashes
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!isEditModalOpen && !editingUser) {
      setFormData({ fullName: '', email: '', role: 'user' });
    }
  }, [isEditModalOpen, editingUser]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // 🔽 FIX: Ensure users is an array before filtering/sorting
  const safeUsers = Array.isArray(users) ? users : [];

  const sortedAndFilteredUsers = [...safeUsers]
    .filter(user => {
      const matchesSearch = (user.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (user.email || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = filterRole === 'all' || user.role === filterRole;
      const matchesVerified = filterVerified === 'all' || 
                              (filterVerified === 'true' ? user.isVerified : !user.isVerified);
      const matchesProvider = filterProvider === 'all' || user.provider === filterProvider;
      return matchesSearch && matchesRole && matchesVerified && matchesProvider;
    })
    .sort((a, b) => {
      if (!sortField) return 0;
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (sortField === 'loyaltyPoints') {
        return sortOrder === 'asc' ? (aValue || 0) - (bValue || 0) : (bValue || 0) - (aValue || 0);
      }
      if (typeof aValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      return 0;
    });

  const totalPages = Math.ceil(sortedAndFilteredUsers.length / itemsPerPage);
  const paginatedUsers = sortedAndFilteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        role: formData.role
      };

      const res = await axios.put(`${API_BASE_URL}/users/${editingUser._id}`, payload);
      
      setUsers(users.map(u => 
        u._id === editingUser._id 
          ? { ...u, ...res.data } 
          : u
      ));

      setIsEditModalOpen(false);
      setEditingUser(null);
      alert("Cập nhật thành công!");

    } catch (error) {
      console.error("Lỗi cập nhật người dùng:", error);
      alert("Không thể cập nhật người dùng. Vui lòng thử lại.");
    }
  };

  const handleToggleBan = async (user) => {
    if (!user) return;

    try {
      const newBanStatus = !user.banned;
      

      const res = await axios.patch(`${API_BASE_URL}/users/${user._id}/ban-status`, { banned: newBanStatus });
      
      setUsers(users.map(u => 
        u._id === user._id 
          ? { ...u, ...res.data }
          : u
      ));
      
      setBanConfirm(null);
      alert(newBanStatus ? "Đã cấm người dùng thành công!" : "Đã mở khóa tài khoản thành công!");

    } catch (error) {
      console.error("Lỗi thay đổi trạng thái cấm:", error);
      alert("Lỗi hệ thống. Không thể thay đổi trạng thái người dùng.");
    }
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      fullName: user.fullName,
      email: user.email,
      role: user.role
    });
    setIsEditModalOpen(true);
  };

  const getProviderIcon = (provider) => {
    switch (provider) {
      case 'google': return <Chrome className="h-4 w-4" />;
      case 'facebook': return <Facebook className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  const getProviderColor = (provider) => {
    switch (provider) {
      case 'google': return 'bg-red-100 text-red-700';
      case 'facebook': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatPoints = (points) => {
    return new Intl.NumberFormat('vi-VN').format(points || 0);
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h1>
          <p className="text-sm text-gray-500 mt-1">Xem, chỉnh sửa và kiểm soát tài khoản người dùng</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Tổng người dùng</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{safeUsers.length}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <UserCheck className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Admin</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                {safeUsers.filter(u => u.role === 'admin').length}
              </p>
            </div>
            <Shield className="h-10 w-10 text-purple-600" />
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Đã xác thực</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {safeUsers.filter(u => u.isVerified).length}
              </p>
            </div>
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Bị cấm</p>
              <p className="text-3xl font-bold text-red-600 mt-2">
                {safeUsers.filter(u => u.banned).length}
              </p>
            </div>
            <Ban className="h-10 w-10 text-red-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm tên hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>
          <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}
            className="px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600">
            <option value="all">Tất cả vai trò</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
          <select value={filterVerified} onChange={(e) => setFilterVerified(e.target.value)}
            className="px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600">
            <option value="all">Tất cả xác thực</option>
            <option value="true">Đã xác thực</option>
            <option value="false">Chưa xác thực</option>
          </select>
          <select value={filterProvider} onChange={(e) => setFilterProvider(e.target.value)}
            className="px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600">
            <option value="all">Tất cả đăng nhập</option>
            <option value="local">Email/Password</option>
            <option value="google">Google</option>
            <option value="facebook">Facebook</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người dùng</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vai trò</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Xác thực</th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Đăng nhập bằng</th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th 
                  className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('loyaltyPoints')}
                >
                  <div className="flex items-center justify-center gap-1">
                    <Star className="h-4 w-4 text-amber-500" />
                    Điểm tích lũy
                    <ArrowUpDown className={`h-3.5 w-3.5 transition-transform ${sortField === 'loyaltyPoints' && sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                  </div>
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedUsers.map((user) => (
                <tr key={user._id} className={`hover:bg-gray-50 transition ${user.banned ? 'opacity-60' : ''}`}>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{user.fullName}</p>
                      <p className="text-sm text-gray-500">ID: {user._id}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700">{user.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {user.isVerified ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mx-auto" title="Đã xác thực" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mx-auto" title="Chưa xác thực" />
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getProviderColor(user.provider)}`}>
                      {getProviderIcon(user.provider)}
                      <span>{user.provider}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      user.banned 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {user.banned ? 'Banned' : 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                      <span className="font-bold text-amber-700 text-lg">
                        {formatPoints(user.loyaltyPoints)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(user)}
                        className="p-2 hover:bg-indigo-50 rounded-lg text-indigo-600 transition"
                        title="Chỉnh sửa"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setBanConfirm(user)}
                        className={`p-2 rounded-lg transition ${
                          user.banned 
                            ? 'hover:bg-green-50 text-green-600' 
                            : 'hover:bg-red-50 text-red-600'
                        }`}
                        title={user.banned ? 'Bỏ cấm' : 'Cấm người dùng'}
                      >
                        {user.banned ? <UserCheck className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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

      {isEditModalOpen && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Chỉnh sửa người dùng</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Họ tên</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vai trò</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-amber-600 fill-amber-500" />
                  <span className="text-sm font-medium text-amber-900">Điểm tích lũy hiện tại</span>
                </div>
                <p className="text-2xl font-bold text-amber-700 mt-2">
                  {formatPoints(editingUser.loyaltyPoints)} điểm
                </p>
                <p className="text-xs text-amber-600 mt-1">Không thể chỉnh sửa trực tiếp</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-6 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleUpdateUser}
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition"
              >
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ban Confirm Modal */}
      {banConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
              <h3 className="text-lg font-bold text-gray-900">Xác nhận hành động</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Bạn có chắc muốn <strong>{banConfirm.banned ? 'BỎ CẤM' : 'CẤM'}</strong> người dùng này?
              <br />
              <strong className="text-gray-900">{banConfirm.fullName}</strong> ({banConfirm.email})
              <br />
              <span className="text-amber-700 font-medium">
                Điểm tích lũy: {formatPoints(banConfirm.loyaltyPoints)}
              </span>
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setBanConfirm(null)}
                className="px-5 py-2.5 border border-gray-300 rounded-xl font-medium hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={() => handleToggleBan(banConfirm)}
                className={`px-5 py-2.5 rounded-xl font-medium text-white ${
                  banConfirm.banned 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {banConfirm.banned ? 'Bỏ cấm' : 'Cấm ngay'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementContent;