import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Shared/Navbar";
import Footer from "../components/Shared/Footer";
import { Helmet } from "react-helmet";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading"); // "loading", "success", "error"
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setStatus("error");
        setMessage("Không tìm thấy mã xác thực trong đường dẫn.");
        return;
      }

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/auth/verify-email?token=${token}`
        );
        setStatus("success");
        setMessage(res.data.message);
      } catch (err) {
        setStatus("error");
        setMessage(
          err.response?.data?.message ||
            "Token không hợp lệ hoặc đã hết hạn."
        );
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Helmet>
        <title>{`Xác nhận email`}</title>
      </Helmet>
      <Navbar />

      <main className="flex flex-1 items-center justify-center text-center px-6">
        <div className="max-w-lg mx-auto">
          {status === "loading" && (
            <>
              <h1 className="text-3xl font-semibold text-gray-700 mb-4">
                Đang xác thực email của bạn...
              </h1>
              <p className="text-gray-600">Vui lòng chờ trong giây lát.</p>
            </>
          )}

          {status === "success" && (
            <>
              <h1 className="text-4xl font-bold text-green-600 mb-4">
                ✅ Xác thực thành công!
              </h1>
              <p className="text-gray-700">{message}</p>
              <a
                href="/login"
                className="inline-block mt-6 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
              >
                Đăng nhập ngay
              </a>
            </>
          )}

          {status === "error" && (
            <>
              <h1 className="text-4xl font-bold text-red-600 mb-4">
                ❌ Xác thực thất bại
              </h1>
              <p className="text-gray-700">{message}</p>
              <a
                href="/resend-verification"
                className="inline-block mt-6 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Gửi lại email xác thực
              </a>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VerifyEmail;
