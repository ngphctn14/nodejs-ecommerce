import React, { useEffect, useState } from "react";
import { User, Mail, Phone, Lock } from "lucide-react";
import axiosClient from "../../api/axiosClient"; 

const UserProfile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axiosClient
      .get("/auth/me")
      .then((res) => {
        setUser(res.data.user);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy thông tin user:", err);
      });
  }, []);

  if (!user) {
    return <p className="text-center text-gray-500">Đang tải thông tin...</p>;
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-md mx-auto">
      <div className="flex flex-col items-center">
        <img
          src="/user.png"
          alt="User Avatar"
          className="w-24 h-24 rounded-full mb-4 border-2 border-gray-200"
        />
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex items-center">
          <User className="w-5 h-5 text-gray-500 mr-2" />
          <span className="text-gray-700">{user.fullName}</span>
        </div>

        <div className="flex items-center">
          <Mail className="w-5 h-5 text-gray-500 mr-2" />
          <span className="text-gray-700">{user.email}</span>
        </div>

        
      </div>

      <div className="mt-6 flex justify-center">
        <button className="flex items-center bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition">
          <Lock className="w-4 h-4 mr-2" />
          Đổi mật khẩu
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
