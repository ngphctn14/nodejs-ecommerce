import Button from "../components/Forms/Button";
import Footer from "../components/Shared/Footer";
import Navbar from "../components/Shared/Navbar";
import { useState } from "react";
import CartItem from "../components/Products/CartItem";

const Cart = () => {
  const [cartItems, setCartItems] = useState([
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
    {
      id: 3,
      name: "Logitech MX Master 3 Mouse",
      size: "Default",
      color: "Black",
      price: 2500000,
      quantity: 1,
      image: "https://via.placeholder.com/80x80.png?text=Mouse",
    },
  ]);

  const increaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex-grow flex flex-col items-center justify-center w-full">
        {cartItems.length === 0 ? (
          <div className="flex flex-col justify-center items-center">
            <p className="mb-4">Giỏ hàng của bạn còn trống</p>
            <Button
              textContent={"Tiếp tục mua sắm"}
              className={"cursor-pointer mb-2"}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full max-w-6xl">
            {/* Cart table */}
            <div className="col-span-1 md:col-span-3">
              <table className="w-full border-collapse">
                <thead className="border-b bg-gray-100">
                  <tr>
                    <th className="p-4 text-left">Sản phẩm</th>
                    <th className="p-4 text-center">Đơn giá</th>
                    <th className="p-4 text-center">Số lượng</th>
                    <th className="p-4 text-center">Số tiền</th>
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
                  {cartItems
                    .reduce(
                      (acc, item) => acc + item.price * item.quantity,
                      0
                    )
                    .toLocaleString("vi-VN")}{" "}
                  ₫
                </span>
              </p>
              <Button textContent="Tiến hành thanh toán" className="w-full" />
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
