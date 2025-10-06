import React, { useState } from 'react';
import { useNavigate } from "react-router";

const OrderManager = () => {
    const navigate = useNavigate()
    const [orders, setOrders] = useState([
    {
      id: 'ORD001',
      products: [{ name: 'Giày Nike PhanTom GX1', quantity: 3, price: 1500000 }],
      address: '123 Đường Láng, Hà Nội',
      paymentMethod: 'Thanh toán khi nhận hàng',
      status: 'Đã đặt',
    },
    {
      id: 'ORD002',
      products: [
        { name: 'Áo Adidas', quantity: 2, price: 800000 },
        { name: 'Quần Adidas', quantity: 1, price: 1200000 },
      ],
      address: '456 Nguyễn Trãi, TP.HCM',
      paymentMethod: 'Thẻ tín dụng',
      status: 'Đang ship',
    },
    {
      id: 'ORD003',
      products: [{ name: 'Bóng Nike', quantity: 1, price: 5000000 }],
      address: '789 Hai Bà Trưng, Đà Nẵng',
      paymentMethod: 'Chuyển khoản ngân hàng',
      status: 'Đã giao',
    },
  ]);

  const handleCancelOrder = (id) => {
    setOrders(orders.map(order => 
      order.id === id && order.status === 'Đã đặt' 
        ? { ...order, status: 'Đã hủy' } 
        : order
    ));
  };

  const handleReviewOrder = (id) => {
    navigate('/products/' + id)
  };

  const calculateTotal = (products) => {
    return products.reduce((total, product) => total + product.price * product.quantity, 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Quản lý đơn hàng</h2>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="border rounded-md p-4 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium text-gray-800">Mã đơn hàng: {order.id}</p>
                <p className="text-gray-600">
                  Sản phẩm:{' '}
                  {order.products.map((product, index) => (
                    <span key={index}>
                      {product.name} x {product.quantity} ({formatCurrency(product.price)}, Tổng: {formatCurrency(product.price * product.quantity)})
                      {index < order.products.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </p>
                <p className="text-gray-600 font-medium mt-2">
                  Tổng tiền: {formatCurrency(calculateTotal(order.products))}
                </p>
                <p className="text-gray-600">Địa chỉ: {order.address}</p>
                <p className="text-gray-600">Hình thức thanh toán: {order.paymentMethod}</p>
                <p className="text-gray-600">Tình trạng: 
                  <span className={`ml-2 ${
                    order.status === 'Đã đặt' ? 'text-blue-500' :
                    order.status === 'Đang ship' ? 'text-yellow-500' :
                    order.status === 'Đã giao' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {order.status}
                  </span>
                </p>
              </div>
              <div className="flex items-center justify-end space-x-4">
                {order.status === 'Đã đặt' && (
                  <button
                    onClick={() => handleCancelOrder(order.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                  >
                    Hủy đơn hàng
                  </button>
                )}
                {order.status === 'Đã giao' && (
                  <button
                    onClick={() => handleReviewOrder(order.id)}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                  >
                    Đánh giá
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderManager;