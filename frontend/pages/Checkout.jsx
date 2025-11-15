import Navbar from "../components/Shared/Navbar";
import Footer from "../components/Shared/Footer";
import Button from "../components/Forms/Button";
import CheckoutItem from "../components/Products/CheckoutItem";
import EmailInput from "../components/Forms/EmailInput";
import AddressList from "../components/Address/AddressList";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axiosClient from "../api/axiosClient";

const Checkout = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setIsLoggedIn(true);
      setShowAddressForm(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [user]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (authLoading) return;

        if (!user) {
          const localCart = JSON.parse(localStorage.getItem("cart")) || [];
          setCartItems(localCart);
          setLoading(false);
          return;
        }

        if (!user.cartId) {
          console.warn("⚠️ User has no cartId");
          setCartItems([]);
          setLoading(false);
          return;
        }

        const res = await axiosClient.get(`/cart-items/${user.cartId}`);
        const formatted = res.data.map((item) => ({
          id: item._id, // This is cartItem._id
          variantId: item.variant?._id, // <-- ADDED: Needed for creating order item
          name: item.product?.name || "Sản phẩm",
          size: item.variant?.attributes?.size || "Default",
          color: item.variant?.attributes?.color || "Default",
          price: item.variant?.price || 0,
          quantity: item.quantity,
          image:
            item.variantImages?.[0] ||
            item.productImages?.[0] ||
            "https://via.placeholder.com/80x80.png?text=Product",
        }));

        setCartItems(formatted);
      } catch (err) {
        console.error("❌ Lỗi khi tải giỏ hàng:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user, authLoading]);

  // 🧠 Keep localStorage synced for guest carts
  useEffect(() => {
    if (!user && !authLoading) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems, user, authLoading]);

  // 🔹 Handle form steps
  const handleContinueToShipping = () => {
    if (!email) {
      alert("Vui lòng nhập email trước khi tiếp tục.");
      return;
    }
    setShowAddressForm(true);
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

const handleCreateCashOrder = async () => {
    if (!user) {
      alert("Bạn phải đăng nhập để hoàn tất đơn hàng.");
      navigate("/login");
      return;
    }

    setIsCreatingOrder(true);
    try {
      const orderData = {
        user_id: user._id,
        address_id: address._id,
        total_price: subtotal,
        status: "confirmed",
        payment_method: "cash",
        payment_status: "unpaid",
      };
      const orderRes = await axiosClient.post("/orders", orderData);
      const newOrder = orderRes.data;

      const orderItemPromises = cartItems.map((item) => {
        return axiosClient.post("/order-items", {
          order_id: newOrder._id,
          product_variant_id: item.variantId,
          quantity: item.quantity,
          price: item.price,
        });
      });
      await Promise.all(orderItemPromises);

      // 3. Delete CartItems
      const deleteCartItemPromises = cartItems.map((item) => {
        return axiosClient.delete(`/cart-items/${item.id}`);
      });
      await Promise.all(deleteCartItemPromises);

      // 4. Navigate
      setCartItems([]);
      alert("Đặt hàng thành công!");
      navigate(`/order-success/${newOrder._id}`);
    } catch (err) {
      console.error("❌ Lỗi khi tạo đơn hàng Tiền Mặt:", err);
      alert("Lỗi khi tạo đơn hàng: " + (err.response?.data?.message || err.message));
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const handleVNPayPayment = async () => {
    if (!user) {
      alert("Bạn phải đăng nhập để hoàn tất đơn hàng.");
      navigate("/login");
      return;
    }

    setIsCreatingOrder(true);
    try {
      const orderData = {
        user_id: user._id,
        address_id: address._id,
        total_price: subtotal,
        status: "pending",
        payment_method: "vnpay",
        payment_status: "unpaid",
      };
      const orderRes = await axiosClient.post("/orders", orderData);
      const newOrder = orderRes.data;

      const orderItemPromises = cartItems.map((item) => {
        return axiosClient.post("/order-items", {
          order_id: newOrder._id,
          product_variant_id: item.variantId,
          quantity: item.quantity,
          price: item.price,
        });
      });
      await Promise.all(orderItemPromises);

      // const deleteCartItemPromises = cartItems.map((item) => {
      //   return axiosClient.delete(`/cart-items/${item.id}`);
      // });

      // await Promise.all(deleteCartItemPromises);

      const paymentRes = await axiosClient.post(
        `/payments/vnpay/pay/${newOrder._id}`
      );

      if (paymentRes.data.paymentUrl) {
        window.location.href = paymentRes.data.paymentUrl;
      } else {
        throw new Error("Không nhận được URL thanh toán từ máy chủ.");
      }
    } catch (err) {
      console.error("Lỗi khi tạo đơn hàng VNPAY:", err);
      alert("Lỗi khi tạo đơn VNPAY: " + (err.response?.data?.message || err.message));
      setIsCreatingOrder(false);
    }
  };

  const handleContinueToPayment = () => {
    if (!address._id) {
      alert("Vui lòng chọn hoặc thêm một địa chỉ giao hàng.");
      return;
    }
    if (!address.paymentMethod) {
      alert("Vui lòng chọn phương thức thanh toán.");
      return;
    }

    // 2. Route based on payment method
    // Sử dụng 'cash' và 'vnpay'
    if (address.paymentMethod === "cash") {
      handleCreateCashOrder();
    } else if (address.paymentMethod === "vnpay") {
      handleVNPayPayment();
    } else {
      alert("Phương thức thanh toán chưa được hỗ trợ.");
    }
  };

  // 🔹 Checkout UI
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex-grow mt-20 p-4 flex flex-col lg:flex-row w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 gap-6">
        {/* LEFT COLUMN */}
        <div className="flex-1 bg-white p-6 rounded shadow min-w-[300px]">
          {!showAddressForm ? (
            // STEP 1: Contact Info
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
            // STEP 2: Shipping Form
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

              <AddressList onSelect={(addr) => setAddress(addr)} />

              <div className="mt-6">
                <h3 className="font-semibold mb-2">Phương thức thanh toán</h3>

                <div className="space-y-3">
                  <label className="flex items-center rounded p-3 cursor-pointer hover:border-blue-400 transition">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="vnpay"
                      checked={address.paymentMethod === "vnpay"}
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
                      value="cash"
                      checked={address.paymentMethod === "cash"}
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
                textContent={
                  isCreatingOrder
                    ? "Đang xử lý..."
                    : "Tiếp tục đến thanh toán"
                }
                onClick={handleContinueToPayment}
                className="mt-6 w-full cursor-pointer"
                disabled={isCreatingOrder}
              />
            </>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div className="bg-white p-6 rounded shadow md:w-full lg:w-[400px] xl:w-[450px] h-fit lg:sticky top-24">
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