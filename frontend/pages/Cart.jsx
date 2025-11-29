import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Forms/Button";
import Footer from "../components/Shared/Footer";
import Navbar from "../components/Shared/Navbar";
import CartItem from "../components/Products/CartItem";
import axiosClient from "../api/axiosClient";
import { AuthContext } from "../context/AuthContext";
import { Helmet } from "react-helmet";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, loading: authLoading } = useContext(AuthContext);

  const fetchCart = async () => {
    try {
      if (authLoading) return;

      if (!user) {
        const localCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCartItems(localCart);
        setLoading(false);
        return;
      }

      const cartId = user.cartId;
      if (!cartId) {
        console.warn("⚠️ User has no cartId");
        setCartItems([]);
        setLoading(false);
        return;
      }

      const res = await axiosClient.get(`/cart-items/${cartId}`);
      const formatted = res.data.map((item) => ({
        id: item._id,
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

  useEffect(() => {
    fetchCart();
  }, [user, authLoading]);

  useEffect(() => {
    if (!user && !authLoading) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems, user, authLoading]);

  const increaseQty = async (id) => {
    try {
      if (user) {
        await axiosClient.put(`/cart-items/${id}/increase`);
        await fetchCart();
      } else {
        setCartItems((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
          )
        );
      }
    } catch (err) {
      console.error("Lỗi khi tăng số lượng:", err);
    }
  };

  const decreaseQty = async (id) => {
    try {
      if (user) {
        await axiosClient.put(`/cart-items/${id}/decrease`);
        await fetchCart(); 
      } else {
        setCartItems((prev) =>
          prev.map((item) =>
            item.id === id && item.quantity > 1
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
        );
      }
    } catch (err) {
      console.error("Lỗi khi giảm số lượng:", err);
    }
  };

  const removeItem = async (id) => {
    try {
      if (user) {
        await axiosClient.delete(`/cart-items/${id}`);
        await fetchCart(); 
      } else {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error("Lỗi khi xóa sản phẩm:", err);
    }
  };

  const navigateProducts = () => navigate("/products");
  const navigateCheckout = () => navigate("/checkout");

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>Đang tải giỏ hàng...</p>
      </div>
    );

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <Helmet>
        <title>{`Giỏ hàng`}</title>
      </Helmet>

      <div className="flex-grow mt-20 p-4 flex flex-col items-center justify-center w-full">
        {cartItems.length === 0 ? (
          <div className="flex flex-col justify-center items-center">
            <p className="mb-4">Giỏ hàng của bạn còn trống</p>
            <Button
              textContent="Tiếp tục mua sắm"
              onClick={navigateProducts}
              className="cursor-pointer mb-2"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full max-w-6xl">
            {/* Cart table */}
            <div className="col-span-1 md:col-span-3 overflow-x-auto">
              <table className="w-full border-collapse min-w-[700px] md:min-w-0">
                <thead className="border-b border-gray-300 bg-gray-100">
                  <tr>
                    <th className="p-4 text-gray-700 text-left">Sản phẩm</th>
                    <th className="p-4 text-gray-700 text-center">Đơn giá</th>
                    <th className="p-4 text-gray-700 text-center">Số lượng</th>
                    <th className="p-4 text-gray-700 text-center">Số tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onIncrease={increaseQty}
                      onDecrease={decreaseQty}
                      onRemove={removeItem}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cart summary */}
            <div className="col-span-1 bg-white p-4 rounded shadow">
              <h2 className="font-semibold mb-4">Tóm tắt đơn hàng</h2>
              <p className="flex justify-between mb-2">
                <span>Tạm tính:</span>
                <span>
                  {subtotal.toLocaleString("vi-VN")} ₫
                </span>
              </p>
              <Button
                onClick={navigateCheckout}
                textContent="Tiến hành thanh toán"
                className="cursor-pointer w-full"
              />
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
