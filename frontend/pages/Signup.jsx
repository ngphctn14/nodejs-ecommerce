import Navbar from "../components/Shared/Navbar";
import Footer from "../components/Shared/Footer";
import TextInput from "../components/Forms/TextInput";
import EmailInput from "../components/Forms/EmailInput";
import PasswordInput from "../components/Forms/PasswordInput";
import GoogleSigninButton from "../components/Forms/GoogleSigninButton";
import Button from "../components/Forms/Button";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { Helmet } from "react-helmet";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup, user } = useContext(AuthContext);

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

    if (!fullName || !email || !password || !confirmPassword) {
      setError("Vui lòng điền đầy đủ thông tin");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu nhập lại không khớp");
      setLoading(false);
      return;
    }

    try {
      const res = await signup(fullName, email, password);
      alert(
        res.message ||
          "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản."
      );
    } catch (err) {
      setError(err.response?.data?.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Helmet>
        <title>{`Đăng ký`}</title>
      </Helmet>
      <Navbar />

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-1 mt-20 mx-auto p-4 w-full max-w-md m-4 rounded-md border border-gray-200 bg-white"
      >
        <h2 className="text-center text-2xl font-semibold">Đăng ký</h2>

        {/* Full Name */}
        <TextInput
          label="Họ và tên"
          placeholder="Nguyễn Văn A"
          id="full-name"
          name="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        {/* Email */}
        <EmailInput
          label="Email"
          placeholder="example@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <PasswordInput
          label="Mật khẩu"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Confirm Password */}
        <PasswordInput
          label="Nhập lại mật khẩu"
          id="confirm-password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {/* Error message */}
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        {/* Submit button */}
        <Button
          type="submit"
          textContent={loading ? "Đang đăng ký..." : "Đăng ký"}
          disabled={loading}
          className="cursor-pointer"
        />

        {/* Divider */}
        <div className="flex w-full items-center gap-2 py-2 text-sm text-gray-900">
          <div className="h-px w-full bg-slate-200"></div>
          HOẶC
          <div className="h-px w-full bg-slate-200"></div>
        </div>

        {/* Google Sign In */}
        <GoogleSigninButton onClick={handleGoogleLogin} className="cursor-pointer" />
      </form>

      <div className="flex-grow"></div>
      <Footer />
    </div>
  );
};

export default Signup;
