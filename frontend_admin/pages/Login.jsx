import React from 'react';
import LoginForm from '../components/LoginForm';

export default function Login() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-8 py-10 shadow-xl rounded-2xl border border-gray-100">
          <div className="text-center mb-8">
            <div className="flex justify-center">
              <div className="bg-indigo-100 p-3 rounded-xl">
                <svg 
                  className="h-10 w-10 text-indigo-600" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                  />
                </svg>
              </div>
            </div>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
              Đăng nhập Admin
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Chào mừng trở lại! Vui lòng đăng nhập vào tài khoản của bạn
            </p>
          </div>

          <LoginForm />
        </div>

        <p className="mt-8 text-center text-sm text-gray-500">
          © 2025 Shop Bóng Đá. All rights reserved.
        </p>
      </div>
    </div>
  );
}