import React from "react";
import Navbar from "../components/Shared/Navbar";
import Footer from "../components/Shared/Footer";
import ProfileForm from "../components/Profile/Profile";
import AddressManager from "../components/Profile/AddressManager";

const Profile = () => {

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow flex justify-center items-start mt-20 mb-10 px-4">
        <div className="w-full max-w-5xl flex flex-col items-start lg:flex-row gap-6">
          <div className="w-full lg:w-1/2 bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
              Thông tin cá nhân
            </h1>
            <ProfileForm />
          </div>
          <div className="w-full lg:w-1/2 bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
              Quản lý địa chỉ
            </h1>
            <AddressManager />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;