import Navbar from "../components/Shared/Navbar";
import Footer from "../components/Shared/Footer";
import Button from "../components/Forms/Button"; // Assuming you have this
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircleIcon } from "@heroicons/react/24/solid"; // Using heroicons for a nice icon

const OrderSuccess = () => {
  const navigate = useNavigate();
  const { orderId } = useParams(); // Get the order ID from the URL

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex flex-1 items-center justify-center text-center px-6">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <CheckCircleIcon className="h-20 w-20 text-green-500 mx-auto" />
          
          <h1 className="text-2xl font-semibold text-gray-800 mt-6">
            Đặt hàng thành công!
          </h1>
          
          <p className="text-gray-600 mt-2">
            Cảm ơn bạn đã mua sắm. Đơn hàng của bạn đang được xử lý.
          </p>
          
          {orderId && (
            <p className="text-sm text-gray-500 mt-2">
              Mã đơn hàng: {orderId}
            </p>
          )}

          <div className="mt-8 space-y-4">
            <Button
              textContent="Xem đơn hàng"
              onClick={() => navigate("/orders")}
              className="w-full cursor-pointer"
            />
            <Button
              textContent="Tiếp tục mua sắm"
              onClick={() => navigate("/products")}
              className="w-full cursor-pointer bg-gray-700 text-gray-800 hover:bg-gray-500"
              variant="secondary"
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderSuccess;