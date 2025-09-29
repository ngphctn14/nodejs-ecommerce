import Button from "../components/Forms/Button";
import EmailInput from "../components/Forms/EmailInput";
import Footer from "../components/Shared/Footer";
import Navbar from "../components/Shared/Navbar";

const ForgotPassword = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex flex-col gap-1 mt-20 mx-auto p-4 w-full max-w-md m-4 rounded-md border border-gray-200 bg-white">
        <div className="ml-auto mr-auto text-2xl font-semibold">Đặt lại mật khẩu</div>
        <div className="pt-5"></div>
        <EmailInput placeholder={"Email"}/>
        <Button textContent={"Tiếp theo"} />
      </div>
      <div className="flex-grow"></div>
      <Footer />
    </div>
  );
};

export default ForgotPassword;