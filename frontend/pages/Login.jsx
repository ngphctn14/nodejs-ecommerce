import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Shared/Navbar";
import Footer from "../components/Shared/Footer";
import EmailInput from "../components/Forms/EmailInput";
import PasswordInput from "../components/Forms/PasswordInput";
import GoogleSigninButton from "../components/Forms/GoogleSigninButton";
import Button from "../components/Forms/Button";
import axiosClient from "../api/axiosClient";

const Login = () => {
  const { login, user } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState("");
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (user) {
      window.location.href = "/";
      return;
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setResendMsg("");
    setCanResend(false);

    try {
      await login(email, password);
      window.location.href = "/";
    } catch (err) {
      setError(err.response?.data?.message || "Đăng nhập thất bại");
      if (err.response?.status === 401) {
        setCanResend(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      console.log(email);
      const res = await axiosClient.post("/auth/resend-verification", { email });
      setResendMsg(res.data.message);
    } catch (err) {
      setResendMsg(err.response?.data?.message || "Không thể gửi lại email xác thực");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-1 mt-20 mx-auto p-4 w-full max-w-md m-4 rounded-md border border-gray-200 bg-white"
      >
        <div className="ml-auto mr-auto text-2xl font-semibold">Đăng nhập</div>

        <EmailInput
          label="Email"
          placeholder="example@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <PasswordInput
          label="Mật khẩu"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {canResend && (
          <div className="text-center mt-3">
            <button
              type="button"
              onClick={handleResendVerification}
              className="text-blue-600 hover:underline text-sm cursor-pointer"
            >
              Gửi lại email xác thực
            </button>
          </div>
        )}

        {resendMsg && (
          <p className="text-green-600 text-sm text-center mt-2">{resendMsg}</p>
        )}

        <p className="mb-3 mt-2 text-sm text-gray-500">
          <a
            href="/forgot-password"
            className="text-[#4285f4] hover:text-blue-600"
          >
            Quên mật khẩu?
          </a>
        </p>

        <Button
          type="submit"
          textContent={loading ? "Đang đăng nhập..." : "Đăng nhập"}
          disabled={loading}
          className="cursor-pointer"
        />

        <div className="flex w-full items-center gap-2 py-2 text-sm text-gray-900">
          <div className="h-px w-full bg-slate-200"></div>
          HOẶC
          <div className="h-px w-full bg-slate-200"></div>
        </div>

        <GoogleSigninButton onClick={handleGoogleLogin} className="cursor-pointer" />

        <div className="mt-2 text-center text-sm text-slate-600">
          Bạn chưa có tài khoản? &#8203;
          <a href="/signup" className="font-medium text-[#4285f4]">
            Đăng ký ngay!
          </a>
        </div>
      </form>

      <div className="flex-grow"></div>

      <Footer />
    </div>
  );
};

export default Login;
