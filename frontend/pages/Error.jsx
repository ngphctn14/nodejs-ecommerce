import Navbar from "../components/Shared/Navbar";
import Footer from "../components/Shared/Footer";
import Button from "../components/Forms/Button";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

const Error = () => {
  const navigate = useNavigate();

  const navigateHome = () => navigate("/");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Helmet>
        <title>{`404 Không tìm thấy trang`}</title>
      </Helmet>
      <Navbar />

      <main className="flex flex-1 items-center justify-center text-center px-6">
        <div>
          <h1 className="text-6xl font-bold text-gray-800">Uh oh!</h1>
          <p className="mt-4 text-2xl font-semibold text-gray-700">
            Trang bạn đang tìm kiếm không tồn tại
          </p>
        <Button
          textContent="Trở về trang chủ"
          onClick={navigateHome}
          className="cursor-pointer mb-2"
        />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Error;