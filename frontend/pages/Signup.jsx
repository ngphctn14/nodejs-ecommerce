import Navbar from "../components/Shared/Navbar";
import Footer from "../components/Shared/Footer";
import TextInput from "../components/Forms/TextInput";
import EmailInput from "../components/Forms/EmailInput";
import PasswordInput from "../components/Forms/PasswordInput";
import GoogleSigninButton from "../components/Forms/GoogleSigninButton";
import Button from "../components/Forms/Button";

const Signup = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex flex-col gap-1 mt-20 mx-auto p-4 w-full max-w-md m-4 rounded-md border border-gray-200 bg-white">
        <div className="ml-auto mr-auto text-2xl font-semibold">Đăng ký</div>
        <TextInput placeholder={"Nguyễn Văn A"} id={"full-name"} name="fullName" />
        <EmailInput label={"Email"} placeholder={"example@gmail.com"}/>
        <PasswordInput label={"Mật khẩu"} id={"password"} name={"password"} />
        <PasswordInput label={"Nhập lại mật khẩu"} id={"confirm-password"} name="confirmPassword" />

        <Button type={"submit"} textContent={"Đăng ký"} className={"cursor-pointer"}/>

        <div className="flex w-full items-center gap-2 py-2 text-sm text-gray-900">
          <div className="h-px w-full bg-slate-200"></div>
          HOẶC
          <div className="h-px w-full bg-slate-200"></div>
        </div>

        <GoogleSigninButton className={"cursor-pointer"} />
      </div>

      <div className="flex-grow"></div>

      <Footer />
    </div>
  );
};

export default Signup;