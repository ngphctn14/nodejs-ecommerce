import Navbar from "../components/Shared/Navbar";
import Footer from "../components/Shared/Footer";
import Button from "../components/Forms/Button"; // Assuming you have this
import { useNavigate } from "react-router-dom";
import { XCircleIcon } from "@heroicons/react/24/solid"; // Using heroicons for a nice icon

const PaymentFailed = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex flex-1 items-center justify-center text-center px-6">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <XCircleIcon className="h-20 w-20 text-red-500 mx-auto" />
          
          <h1 className="text-2xl font-semibold text-gray-800 mt-6">
            Thanh toán thất bại
          </h1>
          
          <p className="text-gray-600 mt-2">
            Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.
          </p>
          
          <Button
            textContent="Thử lại thanh toán"
            onClick={() => navigate("/checkout")}
            className="w-full mt-8 cursor-pointer bg-red-600 hover:bg-red-700"
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentFailed;