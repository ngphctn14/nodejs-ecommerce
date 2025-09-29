import Navbar from "../components/Shared/Navbar";
import Footer from "../components/Shared/Footer";

const Error = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex flex-1 items-center justify-center text-center px-6">
        <div>
          <h1 className="text-6xl font-bold text-gray-800">Uh oh!</h1>
          <p className="mt-4 text-2xl font-semibold text-gray-700">
            Trang bạn đang tìm kiếm không tồn tại
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Error;
