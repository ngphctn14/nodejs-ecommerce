import React, { useState } from 'react';
import axios from 'axios'; 
import { Loader, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setGeneralError('');

  if (validateForm()) {
    setIsLoading(true);
    try {
      // Gọi API
      const response = await axios.post(`${API_BASE_URL}/auth/admin/login`, { email, password });

      const { token, user } = response.data;
      
      localStorage.setItem('accessToken', token);
      localStorage.setItem('user', JSON.stringify(user));

      
      window.location.href = '/'; 

    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Lỗi đăng nhập';
      setGeneralError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }
};

  return (
    <div className="space-y-6">
      {generalError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-700 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{generalError}</span>
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-900 text-left">
          Email
        </label>
        <div className="mt-2">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prev) => ({ ...prev, email: '' }));
              setGeneralError('');
            }}
            className={`block w-full rounded-md px-3 py-2 text-gray-900 placeholder-gray-400 border ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-indigo-600`}
            placeholder="admin@example.com"
            disabled={isLoading}
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="block text-sm font-medium text-gray-900">
            Password
          </label>
        </div>
        <div className="mt-2">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((prev) => ({ ...prev, password: '' }));
              setGeneralError('');
            }}
            className={`block w-full rounded-md px-3 py-2 text-gray-900 placeholder-gray-400 border ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-indigo-600`}
            placeholder="Nhập mật khẩu"
            disabled={isLoading}
          />
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={handleSubmit}
          disabled={!email || !password || isLoading}
          className="w-full flex justify-center items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-colors"
        >
          {isLoading ? (
            <>
              <Loader className="h-4 w-4 animate-spin" /> Đang xử lý...
            </>
          ) : (
            "Đăng nhập quản trị"
          )}
        </button>
      </div>
    </div>
  );
}