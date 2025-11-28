import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Products from "../pages/Products/Products";
import Error from "../pages/Error";
import ForgotPassword from "../pages/ForgotPassword";
import Cart from "../pages/Cart";
import Profile from '../pages/Profile'
import Orders from '../pages/Orders'
import Checkout from "../pages/Checkout";
import VerifyEmail from "../pages/VerifyEmail";
import CategoryPage from "../pages/Products/CategoryPage"
import BrandPage from "../pages/Products/BrandPage"
import PaymentFailed from "../pages/PaymentFailed";
import OrderSuccess from "../pages/OrderSuccess";
import ProductDetailPage from "../pages/Products/ProductDetailPage"; 
import ResetPassword from "../pages/ResetPassword";
import SearchPage from "../pages/Search";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/products" element={<Products />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />

        <Route path="/categories/:slug" element={<CategoryPage />} />
        <Route path="/brands/:slug" element={<BrandPage />} />

        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        <Route path="/payment-failed" element={<PaymentFailed />} />
        <Route path="/order-success/:orderId" element={<OrderSuccess />} />

        <Route path="/reset-password/:token" element={<ResetPassword />} />


        <Route path="*" element={<Error />} />
      </Routes>
    </Router>
  );
}

export default App;
