import Navbar from "../components/Shared/Navbar";
import Footer from "../components/Shared/Footer";
import Button from "../components/Forms/Button";
import CheckoutItem from "../components/Products/CheckoutItem";
import EmailInput from "../components/Forms/EmailInput";
import AddressList from "../components/Address/AddressList";
import DiscountModal from "../components/Checkout/DiscountModal";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axiosClient from "../api/axiosClient";
import { Tag, Coins, Gift } from "lucide-react"; // Added Gift icon
import { Helmet } from "react-helmet";

const POINT_TO_VND_RATE = 10;
const VND_TO_POINT_RATE = 1000;

const Checkout = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState({});
  const [guestSubmitMessage, setGuestSubmitMessage] = useState(null);
  
  // --- New State for Discount & Loyalty ---
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  
  const [userPoints, setUserPoints] = useState(0); 
  const [pointsToUse, setPointsToUse] = useState(0); 
  const [pointsError, setPointsError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setIsLoggedIn(true);
      setShowAddressForm(true);
      fetchUserProfile(); 
    } else {
      setIsLoggedIn(false);
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const res = await axiosClient.get("/auth/me"); 
      setUserPoints(res.data.user.loyaltyPoints || 0);
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
  };

  // ... (fetchCart logic) ...
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
          setCartItems([]);
          setLoading(false);
          return;
        }
        const res = await axiosClient.get(`/cart-items/${user.cartId}`);
        const formatted = res.data.map((item) => ({
          id: item._id,
          variantId: item.variant?._id,
          name: item.product?.name || "Sản phẩm",
          size: item.variant?.attributes?.size || "Default",
          color: item.variant?.attributes?.color || "Default",
          price: item.variant?.price || 0,
          quantity: item.quantity,
          image: item.variantImages?.[0] || item.productImages?.[0] || "https://via.placeholder.com/80x80.png?text=Product",
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

  // ... (handleGuestCheckoutInit logic) ...
  const handleGuestCheckoutInit = async () => {
    try {
      setIsCreatingOrder(true);
      setGuestSubmitMessage(null);
      const localCart = JSON.parse(localStorage.getItem("cart")) || [];
      if (localCart.length === 0) {
        alert("Giỏ hàng của bạn đang trống!");
        return;
      }
      const res = await axiosClient.post("/auth/guest-checkout-init", {
        email: email,
        localCartItems: localCart,
      });
      setGuestSubmitMessage(res.data.message);
      setShowAddressForm(true);
    } catch (err) {
      console.error("Lỗi khởi tạo Guest Checkout:", err);
      setGuestSubmitMessage(err.response?.data?.message || "Lỗi không xác định khi gửi email.");
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const handleContinueToShipping = () => {
    if (!email) {
      alert("Vui lòng nhập email trước khi tiếp tục.");
      return;
    }
    if (!isLoggedIn) {
      handleGuestCheckoutInit();
    } else {
      setShowAddressForm(true);
    }
  };

  // --- Calculation Logic ---
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // 1. Calculate Discount (Percent based)
  let discountAmount = 0;
  if (selectedDiscount) {
    discountAmount = Math.round(subtotal * (selectedDiscount.discount_value / 100));
    if (selectedDiscount.maxDiscountAmount && discountAmount > selectedDiscount.maxDiscountAmount) {
      discountAmount = selectedDiscount.maxDiscountAmount;
    }
  }

  // 2. Calculate Loyalty Discount (Fixed Amount)
  const pointsDiscountValue = pointsToUse * POINT_TO_VND_RATE;

  // 3. Final Total
  const finalTotal = Math.max(0, subtotal - discountAmount - pointsDiscountValue);

  // 4. Calculate Points Earned (on Final Total)
  const pointsEarned = Math.floor(finalTotal / VND_TO_POINT_RATE);


  const handlePointsChange = (e) => {
    // Remove leading zeros and ensure valid number
    const valStr = e.target.value.replace(/^0+/, '') || "0";
    const val = parseInt(valStr, 10);
    
    setPointsError("");
    
    if (isNaN(val) || val < 0) return;

    if (val > userPoints) {
        setPointsError(`Bạn chỉ có tối đa ${userPoints} điểm.`);
        setPointsToUse(userPoints);
    } else {
        // Ensure points value doesn't exceed remaining total after discount
        const remainingTotal = subtotal - discountAmount;
        const maxPointsUsable = Math.floor(remainingTotal / POINT_TO_VND_RATE);
        
        if (val > maxPointsUsable) {
            setPointsError(`Điểm thưởng vượt quá giá trị đơn hàng.`);
            setPointsToUse(maxPointsUsable);
        } else {
            setPointsToUse(val);
        }
    }
  };

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
        total_price: finalTotal, 
        status: "pending",
        payment_method: "cash",
        payment_status: "unpaid",
        discount_code_id: selectedDiscount?._id || null,
        loyalty_points_used: pointsToUse,
        loyalty_points_earned: pointsEarned
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

      const deleteCartItemPromises = cartItems.map((item) => {
        return axiosClient.delete(`/cart-items/${item.id}`);
      });
      await Promise.all(deleteCartItemPromises);

      setCartItems([]);
      alert(`Đặt hàng thành công! Bạn đã nhận được ${pointsEarned} điểm.`);
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
        total_price: finalTotal,
        status: "pending",
        payment_method: "vnpay",
        payment_status: "unpaid",
        discount_code_id: selectedDiscount?._id || null,
        loyalty_points_used: pointsToUse,
        loyalty_points_earned: pointsEarned
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
    if (address.paymentMethod === "cash") {
      handleCreateCashOrder();
    } else if (address.paymentMethod === "vnpay") {
      handleVNPayPayment();
    } else {
      alert("Phương thức thanh toán chưa được hỗ trợ.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>Đang tải giỏ hàng...</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center">
          <p className="mb-4">Giỏ hàng của bạn còn trống</p>
          <Button
            textContent="Tiếp tục mua sắm"
            onClick={() => navigate("/products")}
            className="cursor-pointer"
          />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Helmet>
        <title>{`Thanh toán`}</title>
      </Helmet>
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
                  disabled={isCreatingOrder}
                />

                <Button
                  type="submit"
                  textContent="Tiếp tục đến giao hàng"
                  className="w-full cursor-pointer mt-4"
                  disabled={isCreatingOrder}
                />
              </form>
            </>
          ) : (
            // STEP 2: Shipping Form
            <>
              {!isLoggedIn && guestSubmitMessage && (
                <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded-md">
                  {guestSubmitMessage}
                  <span className="font-semibold block mt-1">
                    Vui lòng kiểm tra email để đăng nhập và tiếp tục.
                  </span>
                </div>
              )}
              
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
                  isCreatingOrder ? "Đang xử lý..." : "Tiếp tục đến thanh toán"
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

          {/* --- Discount & Points Section --- */}
          <div className="mt-6 pt-4 border-t border-gray-200 space-y-4">
            
            {/* Discount Code Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mã giảm giá</label>
              <div className="flex gap-2">
                 <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                       <Tag className="h-4 w-4 text-gray-400" />
                    </div>
                    <input 
                        type="text"
                        readOnly
                        value={selectedDiscount ? selectedDiscount.code : ""}
                        placeholder="Chọn mã giảm giá"
                        onClick={() => setIsDiscountModalOpen(true)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer bg-gray-50 hover:bg-white transition-colors"
                    />
                 </div>
                 {selectedDiscount && (
                     <button 
                        onClick={() => setSelectedDiscount(null)}
                        className="text-red-500 text-sm hover:underline px-2"
                     >
                        Xóa
                     </button>
                 )}
              </div>
              {selectedDiscount && (
                 <p className="text-xs text-green-600 mt-1">
                    Đã áp dụng mã {selectedDiscount.code}: Giảm {selectedDiscount.discount_value}% 
                    {selectedDiscount.maxDiscountAmount ? ` (Tối đa ${selectedDiscount.maxDiscountAmount.toLocaleString()}đ)` : ""}
                 </p>
              )}
            </div>

            {/* Loyalty Points Input (Only if Logged In) */}
            {isLoggedIn && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Điểm tích lũy <span className="text-gray-500 font-normal">(Hiện có: {userPoints})</span>
                    </label>
                    <div className="flex gap-2 items-center">
                        <div className="relative flex-grow">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Coins className="h-4 w-4 text-amber-500" />
                            </div>
                            <input 
                                type="text"
                                value={pointsToUse > 0 ? pointsToUse : ""}
                                onChange={handlePointsChange}
                                placeholder="Nhập số điểm"
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <span className="text-sm text-gray-500 whitespace-nowrap">
                           / {userPoints} điểm
                        </span>
                    </div>
                    {pointsError && <p className="text-xs text-red-500 mt-1">{pointsError}</p>}
                    {pointsToUse > 0 && !pointsError && (
                        <p className="text-xs text-green-600 mt-1">
                            Sử dụng {pointsToUse} điểm: Giảm {pointsDiscountValue.toLocaleString()} ₫
                        </p>
                    )}
                </div>
            )}
          </div>

          {/* Totals */}
          <div className="mt-4 border-t border-gray-300 pt-4 text-gray-800">
            <p className="flex justify-between mb-2">
              <span>Tạm tính</span>
              <span>{subtotal.toLocaleString("vi-VN")} ₫</span>
            </p>
            
            {selectedDiscount && (
                 <p className="flex justify-between mb-2 text-green-600">
                  <span>Giảm giá ({selectedDiscount.code})</span>
                  <span>- {discountAmount.toLocaleString("vi-VN")} ₫</span>
                </p>
            )}

            {pointsToUse > 0 && (
                <p className="flex justify-between mb-2 text-green-600">
                  <span>Điểm thưởng</span>
                  <span>- {pointsDiscountValue.toLocaleString("vi-VN")} ₫</span>
                </p>
            )}

            <p className="flex justify-between font-semibold text-lg border-t border-gray-300 pt-2">
              <span>Tổng cộng</span>
              <span>{finalTotal.toLocaleString("vi-VN")} ₫</span>
            </p>

            {isLoggedIn && pointsEarned > 0 && (
                <div className="mt-2 flex items-center justify-end gap-1 text-sm text-indigo-600 bg-indigo-50 p-2 rounded-md">
                   <Gift className="w-4 h-4" />
                   <span>Bạn sẽ nhận được <strong>{pointsEarned}</strong> điểm cho đơn hàng này!</span>
                </div>
            )}
          </div>
        </div>
      </div>

      {/* Discount Selection Modal */}
      <DiscountModal 
        isOpen={isDiscountModalOpen} 
        onClose={() => setIsDiscountModalOpen(false)}
        onSelect={(discount) => setSelectedDiscount(discount)}
      />

      <Footer />
    </div>
  );
};

export default Checkout;