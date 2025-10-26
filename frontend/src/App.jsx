import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Products from "../pages/Products/Products";
import AdidasBrand from "../pages/Products/Brands/AdidasBrand"
import NikeBrand from "../pages/Products/Brands/NikeBrand"
import PumaBrand from "../pages/Products/Brands/PumaBrand"
import OthersBrand from "../pages/Products/Brands/OthersBrand"
import FGType from "../pages/Products/Types/FGType"
import TFType from "../pages/Products/Types/TFType"
import Futsal from "../pages/Products/Types/Futsal"
import OthersProducts from "../pages/Products/Types/OthersProducts"
import Error from "../pages/Error";
import ForgotPassword from "../pages/ForgotPassword";
import Cart from "../pages/Cart";
import Profile from '../pages/Profile'
import Orders from '../pages/Orders'
import Checkout from "../pages/Checkout";
import VerifyEmail from "../pages/VerifyEmail";

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
        <Route path="/brands/adidas" element={<AdidasBrand />} />
        <Route path="/brands/nike" element={<NikeBrand />} />
        <Route path="/brands/puma" element={<PumaBrand />} />
        <Route path="/brands/others" element={<OthersBrand />} />
        <Route path="/categories/co-tu-nhien" element={<FGType />} />
        <Route path="/categories/co-nhan-tao" element={<TFType />} />
        <Route path="/categories/futsal" element={<Futsal />} />
        <Route path="/categories/others" element={<OthersProducts />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/verify-email" element={<VerifyEmail />} />



        <Route path="*" element={<Error />} />
      </Routes>
    </Router>
  );
}

export default App;
