import { useState } from "react";
import Navbar from "../components/Shared/Navbar";
import Footer from "../components/Shared/Footer";
import Button from "../components/Forms/Button";
import axiosClient from "../api/axiosClient";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    
    try {
      const res = await axiosClient.post("/auth/forgot-password", { email });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Lỗi gửi yêu cầu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-6">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">Quên mật khẩu?</h1>
          <p className="text-gray-600 text-center mb-6 text-sm">
            Nhập email của bạn và chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu.
          </p>

          {message && (
            <div className="p-4 mb-4 text-sm text-blue-700 bg-blue-100 rounded-lg">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
            />
            <Button
              type="submit"
              textContent={loading ? "Đang gửi..." : "Gửi yêu cầu"}
              className="w-full cursor-pointer"
              disabled={loading}
            />
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ForgotPassword;