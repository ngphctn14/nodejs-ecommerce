// src/pages/Checkout.jsx
import Navbar from "../components/Shared/Navbar";
import Footer from "../components/Shared/Footer";
import Button from "../components/Forms/Button";
import CheckoutItem from "../components/Products/CheckoutItem";
import TextInput from "../components/Forms/TextInput";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import EmailInput from "../components/Forms/EmailInput";

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setIsLoggedIn(true);
      setShowAddressForm(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [user]);

  const [cartItems] = useState([
    {
      id: 1,
      name: "Nike React Infinity Run Flyknit",
      size: "L",
      color: "Purple",
      price: 543000,
      quantity: 2,
      image: "https://via.placeholder.com/80x80.png?text=Nike",
    },
    {
      id: 2,
      name: "MacBook Pro 14-inch",
      size: "Default",
      color: "Space Gray",
      price: 45000000,
      quantity: 1,
      image: "https://via.placeholder.com/80x80.png?text=MacBook",
    },
  ]);

  const [email, setEmail] = useState("");
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    province: "",
    ward: "",
    detail: "",
  });

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleContinueToShipping = () => {
    if (!email) {
      alert("Vui lòng nhập email trước khi tiếp tục.");
      return;
    }
    setShowAddressForm(true);
  };

  const handleContinueToPayment = () => {
    alert("Chuyển sang bước thanh toán!");
    navigate("/payment");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex-grow mt-15 flex flex-col md:flex-row max-w-6xl mx-auto p-6 gap-6">
        {/* LEFT COLUMN */}
        <div className="flex-1 bg-white p-6 rounded shadow">
          {!showAddressForm ? (
            // ===== STEP 1: CONTACT INFO =====
            <>
              <h2 className="text-xl font-semibold mb-4">Thông tin liên hệ</h2>
              <p className="mb-2">
                Đã có tài khoản?{" "}
                <a href="/login" className="text-blue-600 hover:underline">
                  Đăng nhập
                </a>
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleContinueToShipping();
                }}
              >
                <EmailInput
                  id="email"
                  name="email"
                  placeholder="Nhập email của bạn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <Button
                  type="submit"
                  textContent="Tiếp tục đến giao hàng"
                  className="w-full cursor-pointer mt-4"
                />
              </form>
            </>
          ) : (
            // ===== STEP 2: SHIPPING FORM =====
            <>
              <div className="mb-6 pb-3 border-b border-gray-300 flex justify-between items-center">
                <div>
                  <p className="font-medium">Liên hệ</p>
                  <p className="text-gray-600">
                    {isLoggedIn ? user.email : email}
                  </p>
                </div>
                {!isLoggedIn && (
                  <button
                    onClick={() => setShowAddressForm(false)}
                    className="text-blue-600 hover:underline"
                  >
                    Thay đổi
                  </button>
                )}
              </div>

              <h2 className="text-lg font-semibold mb-4">Địa chỉ giao hàng</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <TextInput
                  label={"Họ và tên"}
                  id="fullName"
                  name="fullName"
                  placeholder="Nhập họ và tên"
                  value={address.fullName}
                  onChange={handleAddressChange}
                />

                <TextInput
                  label={"Số điện thoại"}
                  id="phone"
                  name="phone"
                  placeholder="Nhập số điện thoại"
                  value={address.phone}
                  onChange={handleAddressChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <TextInput
                  label={"Tỉnh / thành phố"}
                  id="province"
                  name="province"
                  placeholder="Nhập tỉnh / thành phố"
                  value={address.province}
                  onChange={handleAddressChange}
                />

                <TextInput
                  label={"Phường / xã"}
                  id="ward"
                  name="ward"
                  placeholder="Nhập phường / xã"
                  value={address.ward}
                  onChange={handleAddressChange}
                />
              </div>

              <TextInput
                label={"Địa chỉ"}
                id="detail"
                name="detail"
                placeholder="Nhập địa chỉ (đường, số nhà)"
                value={address.detail}
                onChange={handleAddressChange}
              />

              <div className="mt-6">
                <h3 className="font-semibold mb-2">Phương thức thanh toán</h3>

                <div className="space-y-3">
                  <label className="flex items-center rounded p-3 cursor-pointer hover:border-blue-400 transition">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="VNPay"
                      checked={address.paymentMethod === "VNPay"}
                      onChange={(e) =>
                        setAddress({
                          ...address,
                          paymentMethod: e.target.value,
                        })
                      }
                      className="mr-3 accent-blue-500"
                    />
                    <span className="text-gray-700 font-medium">VNPay</span>
                  </label>

                  <label className="flex items-center rounded p-3 cursor-pointer hover:border-blue-400 transition">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="TienMat"
                      checked={address.paymentMethod === "TienMat"}
                      onChange={(e) =>
                        setAddress({
                          ...address,
                          paymentMethod: e.target.value,
                        })
                      }
                      className="mr-3 accent-blue-500"
                    />
                    <span className="text-gray-700 font-medium">Tiền mặt</span>
                  </label>
                </div>
              </div>

              <Button
                textContent="Tiếp tục đến thanh toán"
                onClick={handleContinueToPayment}
                className="mt-6 w-full cursor-pointer"
              />
            </>
          )}
        </div>

        {/* RIGHT COLUMN: ORDER SUMMARY */}
        <div className="bg-white p-6 rounded shadow">
          {cartItems.map((item) => (
            <CheckoutItem key={item.id} item={item} />
          ))}

          <div className="mt-4 border-t border-gray-300 pt-4 text-gray-800">
            <p className="flex justify-between mb-2">
              <span>Tạm tính</span>
              <span>{subtotal.toLocaleString("vi-VN")} ₫</span>
            </p>
            <p className="flex justify-between mb-2">
              <span>Giảm giá</span>
              <span>0 ₫</span>
            </p>
            <p className="flex justify-between font-semibold text-lg border-t border-gray-300 pt-2">
              <span>Tổng cộng</span>
              <span>{subtotal.toLocaleString("vi-VN")} ₫</span>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;
