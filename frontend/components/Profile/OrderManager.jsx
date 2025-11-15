import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import axiosClient from "../../api//axiosClient";
import { AuthContext } from "../../context/AuthContext";

const OrderDetailsModal = ({ order, onClose, formatCurrency }) => {
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const backdropStyle = {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(4px)",
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center
                  transition-opacity duration-300 ease-in-out
                  ${order ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      style={order ? backdropStyle : {}}
      onClick={handleBackdropClick}
    >
      <div
        className={`bg-white rounded-lg shadow-xl max-w-lg w-full p-6 m-4
                    transition-all duration-300 ease-in-out
                    ${order ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
      >
        {/* ...rest of your modal is identical... */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">
            Chi tiết đơn hàng: {order?.id}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-2xl"
          >
            &times;
          </button>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {order?.products.map((product, index) => (
            <div key={index} className="flex items-center pb-3 pt-2 space-x-3">
              <img
                src={product.image}
                alt={product.name}
                className="w-16 h-16 object-cover rounded-md"
              />
              <div className="flex-grow">
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-gray-600">
                  Số lượng: {product.quantity}
                </p>
              </div>
              <p className="text-gray-800">
                {formatCurrency(product.price * product.quantity)}
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
        >
          Đóng
        </button>
      </div>
    </div>
  );
};

const OrderManager = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, loading: authLoading } = useContext(AuthContext);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(5);

  useEffect(() => {
    const fetchUserOrders = async (pageToFetch) => {
      try {
        setLoading(true);
        setError(null);

        const res = await axiosClient.get("/orders/my-orders", {
          params: {
            page: pageToFetch,
            limit: limit,
          },
        });

        const { orders: fetchedOrders, totalPages: fetchedTotalPages } =
          res.data;

        const ordersWithItems = await Promise.all(
          fetchedOrders.map(async (order) => {
            try {
              const itemsRes = await axiosClient.get(
                `/orders/${order._id}/items`
              );
              const products = itemsRes.data.map((item) => ({
                productId: item.productId,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                image: item.image,
              }));

              return {
                id: order._id,
                products: products,
                address: order.address_id,
                paymentMethod: order.payment_method, // Lấy từ DB
                paymentStatus: order.payment_status,
                status: order.status,
              };
            } catch (itemError) {
              console.error(
                `Lỗi khi tải items cho đơn ${order._id}:`,
                itemError
              );
              return { ...order, id: order._id, products: [] };
            }
          })
        );

        setOrders(ordersWithItems);
        setTotalPages(fetchedTotalPages); // 👈 Cập nhật tổng số trang
      } catch (err) {
        console.error("Lỗi khi tải đơn hàng:", err);
        setError("Không thể tải đơn hàng.");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user) {
      fetchUserOrders(currentPage); // 👈 Gọi hàm với trang hiện tại
    } else if (!user && !authLoading) {
      setLoading(false);
      setError("Bạn phải đăng nhập để xem đơn hàng.");
    }
  }, [user, authLoading, currentPage, limit]);

  const handleCancelOrder = async (e, id) => {
    e.stopPropagation();
    try {
      const res = await axiosClient.put(`/orders/${id}`, {
        status: "Đã hủy",
      });
      setOrders(
        orders.map((order) =>
          order.id === id ? { ...order, status: res.data.status } : order
        )
      );
    } catch (err) {
      console.error("Lỗi khi hủy đơn hàng:", err);
      alert("Hủy đơn hàng thất bại.");
    }
  };

  const handleReviewOrder = (e, order) => {
    e.stopPropagation();
    if (order.products.length > 0) {
      const firstProductId = order.products[0].productId;
      if (firstProductId) {
        navigate(`/products/${firstProductId}`);
      } else {
        console.warn("Không tìm thấy ID sản phẩm để đánh giá.");
      }
    }
  };

  // --- Modal Handlers ---
  const handleOpenModal = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  // --- Helper Functions ---

  const calculateTotal = (products) => {
    return products.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatAddress = (addressObj) => {
    if (!addressObj || typeof addressObj !== "object") {
      return "Không có thông tin địa chỉ";
    }
    return `${addressObj.addressLine}, ${addressObj.ward}, ${addressObj.province}`;
  };

  const getStatusComponent = (status) => {
    let text = "";
    let className = "";

    switch (status) {
      case "pending":
        text = "Chờ xử lý";
        className = "text-blue-500";
        break;
      case "confirmed":
        text = "Đã xác nhận";
        className = "text-cyan-500";
        break;
      case "shipping":
        text = "Đang giao";
        className = "text-yellow-500";
        break;
      case "delivered":
        text = "Đã giao";
        className = "text-green-500";
        break;
      case "cancelled":
        text = "Đã hủy";
        className = "text-red-500";
        break;
      case "paid":
        text = "Đã thanh toán";
        className = "text-green-500";
        break;
      case "unpaid":
        text = "Chưa thanh toán";
        className = "text-red-500";
        break;
      default:
        text = status;
        className = "text-gray-500";
    }
    return <span className={`ml-2 font-medium ${className}`}>{text}</span>;
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // ---------------- RENDER LOGIC ----------------

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center">
        Đang tải đơn hàng...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center text-red-500">
        {error}
      </div>
    );
  }

  if (orders.length === 0 && !loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center">
        Bạn chưa có đơn hàng nào.
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Quản lý đơn hàng
      </h2>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border border-gray-300 rounded-md p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition"
            onClick={() => handleOpenModal(order)}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium text-gray-800">
                  Mã đơn hàng: {order.id}
                </p>
                <p className="text-gray-600">
                  Sản phẩm:{" "}
                  {order.products.length > 0 ? (
                    <span className="text-sm">
                      {order.products[0].name}
                      {order.products.length > 1 &&
                        `, và ${order.products.length - 1} sản phẩm khác...`}
                    </span>
                  ) : (
                    <span>Không có thông tin sản phẩm</span>
                  )}
                </p>
                <p className="text-gray-600 font-medium mt-2">
                  Tổng tiền: {formatCurrency(calculateTotal(order.products))}
                </p>

                <p className="text-gray-600">
                  Địa chỉ: {formatAddress(order.address)}
                </p>

                <p className="text-gray-600">
                  Hình thức thanh toán:{" "}
                  {order.paymentMethod === "vnpay" ? "VNPay" : "Tiền mặt"}
                </p>

                <p className="text-gray-600">
                  Tình trạng thanh toán:
                  {getStatusComponent(order.paymentStatus)}
                </p>

                <p className="text-gray-600">
                  Tình trạng đơn hàng:
                  {getStatusComponent(order.status)}
                </p>
              </div>

              <div className="flex items-center justify-end space-x-4">
                {order.status === "pending" && (
                  <button
                    onClick={(e) => handleCancelOrder(e, order.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                  >
                    Hủy đơn hàng
                  </button>
                )}
                {order.status === "delivered" && (
                  <button
                    onClick={(e) => handleReviewOrder(e, order)}
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

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-200">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {/* <ChevronLeftIcon className="h-5 w-5" /> */}
            Trang trước
          </button>

          <span className="text-gray-700">
            Trang {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Trang sau
            {/* <ChevronRightIcon className="h-5 w-5" /> */}
          </button>
        </div>
      )}

      <OrderDetailsModal
        order={selectedOrder}
        onClose={handleCloseModal}
        formatCurrency={formatCurrency}
      />
    </div>
  );
};

export default OrderManager;
