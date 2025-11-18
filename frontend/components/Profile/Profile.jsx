import React, { useEffect, useState } from "react";
import { User, Mail, Lock, Pencil, X } from "lucide-react";
import axiosClient from "../../api/axiosClient";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  // Form States
  const [newName, setNewName] = useState("");
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Backdrop Style for Modals
  const backdropStyle = {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(4px)",
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = () => {
    axiosClient
      .get("/auth/me")
      .then((res) => {
        setUser(res.data.user);
        setNewName(res.data.user.fullName);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy thông tin user:", err);
        setLoading(false);
      });
  };

  // --- Handlers ---

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosClient.put("/users/profile", { fullName: newName });
      setUser({ ...user, fullName: res.data.fullName });
      setIsEditProfileOpen(false);
      alert("Cập nhật thông tin thành công!");
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi khi cập nhật");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Mật khẩu mới không khớp!");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
        alert("Mật khẩu mới phải có ít nhất 6 ký tự");
        return;
    }

    try {
      await axiosClient.put("/users/change-password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setIsChangePasswordOpen(false);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      alert("Đổi mật khẩu thành công!");
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi khi đổi mật khẩu");
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500 mt-10">Đang tải thông tin...</p>;
  }

  if (!user) return null;

  return (
    <>
      {/* Simple CSS for Fade In Animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>

      <div className="min-h-screen bg-gray-50 py-10">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md mx-auto relative">
          
          {/* Avatar Section */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                src="/user.png" // Replace with user.avatar if available
                alt="User Avatar"
                className="w-24 h-24 rounded-full mb-4 border-2 border-gray-200 object-cover"
              />
              {/* Optional: Camera icon to change avatar could go here */}
            </div>
            <h2 className="text-xl font-semibold text-gray-800">{user.fullName}</h2>
            <p className="text-gray-500 text-sm">{user.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}</p>
          </div>

          {/* Info Section */}
          <div className="mt-8 space-y-6">
            {/* Name Field */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center">
                <User className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold">Họ và tên</p>
                  <span className="text-gray-700 font-medium">{user.fullName}</span>
                </div>
              </div>
              <button 
                onClick={() => setIsEditProfileOpen(true)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition"
                title="Chỉnh sửa tên"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </div>

            {/* Email Field (Read Only) */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold">Email</p>
                  <span className="text-gray-700 font-medium">{user.email}</span>
                </div>
              </div>
              {/* No edit button for email usually */}
            </div>
          </div>

          {/* Change Password Button */}
          <div className="mt-8 flex justify-center">
            <button 
              onClick={() => setIsChangePasswordOpen(true)}
              className="flex items-center bg-gray-100 text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-200 transition font-medium"
            >
              <Lock className="w-4 h-4 mr-2" />
              Đổi mật khẩu
            </button>
          </div>
        </div>

        {/* --- EDIT PROFILE MODAL --- */}
        {isEditProfileOpen && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={backdropStyle}
          >
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 relative animate-fadeIn">
              <button 
                onClick={() => setIsEditProfileOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-bold text-gray-800 mb-4">Cập nhật thông tin</h3>
              
              <form onSubmit={handleUpdateProfile}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Lưu thay đổi
                </button>
              </form>
            </div>
          </div>
        )}

        {/* --- CHANGE PASSWORD MODAL --- */}
        {isChangePasswordOpen && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={backdropStyle}
          >
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 relative animate-fadeIn">
              <button 
                onClick={() => setIsChangePasswordOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-bold text-gray-800 mb-4">Đổi mật khẩu</h3>
              
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu hiện tại</label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nhập lại mật khẩu mới</label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Xác nhận đổi
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </>
  );
};

export default UserProfile;