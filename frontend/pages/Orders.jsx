import React from "react";
import Navbar from "../components/Shared/Navbar";
import Footer from "../components/Shared/Footer";
import OrderManager from "../components/Profile/OrderManager";

const Orders = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow flex justify-center items-start mt-20 mb-10 px-4">
        <div className="w-full max-w-4xl">
          <OrderManager />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Orders;