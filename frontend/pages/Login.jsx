import Navbar from "../components/Shared/Navbar";
import Footer from "../components/Shared/Footer";
import TextInput from "../components/Forms/TextInput";
import EmailInput from "../components/Forms/EmailInput";
import PasswordInput from "../components/Forms/PasswordInput";
import GoogleSigninButton from "../components/Forms/GoogleSigninButton";
import Button from "../components/Forms/Button";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <form
        action=""
        className="flex flex-col gap-1 mt-20 mx-auto p-4 w-full max-w-md m-4 rounded-md border border-gray-200 bg-white"
      >
        <div className="ml-auto mr-auto text-2xl font-semibold">Đăng nhập</div>
        <EmailInput />
        <PasswordInput />
        <p class="mb-3 mt-2 text-sm text-gray-500">
          <a href="/forgot-password" class="text-[#4285f4] hover:text-blue-600">
            Quên mật khẩu?
          </a>
        </p>

        <Button type={"submit"} textContent={"Đăng nhập"} />

        <div class="flex w-full items-center gap-2 py-2 text-sm text-gray-900">
          <div class="h-px w-full bg-slate-200"></div>
          HOẶC
          <div class="h-px w-full bg-slate-200"></div>
        </div>

        <GoogleSigninButton />

        <div class="mt-2 text-center text-sm text-slate-600">
          Bạn chưa có tài khoản? &#8203;
          <a href="/signup" class="font-medium text-[#4285f4]">
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
