import Navbar from "../components/Shared/Navbar";
import Footer from "../components/Shared/Footer";
import TextInput from "../components/Forms/TextInput";
import EmailInput from "../components/Forms/EmailInput";
import PasswordInput from "../components/Forms/PasswordInput";
import GoogleSigninButton from "../components/Forms/GoogleSigninButton";
import Button from "../components/Forms/Button";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

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
      window.location.href="/";
      return;
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!fullName || !email || !password || !confirmPassword) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu nhập lại không khớp");
      return;
    }

    setLoading(true);
    try {
      await signup(fullName, email, password);
      window.location.href = "/";
    } catch (err) {
      setError(err.response?.data?.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 mt-20 mx-auto p-6 w-full max-w-md rounded-md border border-gray-200 bg-white"
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
        <GoogleSigninButton className="cursor-pointer" />
      </form>

      <div className="flex-grow"></div>
      <Footer />
    </div>
  );
};

export default Signup;
