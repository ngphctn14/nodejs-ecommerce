import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Shared/Navbar";
import Footer from "../components/Shared/Footer";
import Button from "../components/Forms/Button";
import axiosClient from "../api/axiosClient";
import { LockClosedIcon } from "@heroicons/react/24/solid";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    setLoading(true);
    try {
      const res = await axiosClient.post(`/auth/reset-password/${token}`, { password });
      setMessage(res.data.message);
      // Redirect to home or login after 2 seconds
      setTimeout(() => navigate("/"), 2000); 
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi khi đặt lại mật khẩu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-center mb-6">
            <LockClosedIcon className="h-12 w-12 text-blue-600 mx-auto" />
            <h1 className="text-2xl font-bold text-gray-800 mt-4">Đặt lại mật khẩu</h1>
            <p className="text-gray-600 text-sm mt-2">Nhập mật khẩu mới của bạn bên dưới.</p>
          </div>

          {message ? (
             <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg text-center">
               {message}
             </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">
                  {error}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
                <input
                  type="password"
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu</label>
                <input
                  type="password"
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <Button
                type="submit"
                textContent={loading ? "Đang xử lý..." : "Đổi mật khẩu"}
                className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              />
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResetPassword;