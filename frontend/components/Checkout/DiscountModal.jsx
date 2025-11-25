import React, { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import { X, Tag, Calendar } from "lucide-react";

const DiscountModal = ({ isOpen, onClose, onSelect }) => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchDiscounts();
    }
  }, [isOpen]);

  const fetchDiscounts = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get("/discount-codes");
      setDiscounts(res.data);
    } catch (error) {
      console.error("Error fetching discounts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Backdrop Style for Modals with Blur
  const backdropStyle = {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(4px)",
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
      style={backdropStyle}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative overflow-hidden flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Tag className="w-5 h-5 text-blue-600" /> Chọn mã giảm giá
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3 bg-gray-50">
          {loading ? (
            <p className="text-center text-gray-500 py-4">Đang tải mã giảm giá...</p>
          ) : discounts.length === 0 ? (
            <p className="text-center text-gray-500 py-4">Không có mã giảm giá nào.</p>
          ) : (
            discounts.map((discount) => (
              <div
                key={discount._id}
                onClick={() => {
                  onSelect(discount);
                  onClose();
                }}
                className="bg-white border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-blue-500 hover:shadow-md transition-all group"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-lg font-bold text-blue-600 block group-hover:scale-105 transition-transform origin-left">
                      {discount.code}
                    </span>
                    <p className="text-sm text-gray-600 mt-1">
                      Giảm {discount.discountPercent}% 
                      {discount.maxDiscountAmount && ` (Tối đa ${discount.maxDiscountAmount.toLocaleString()}đ)`}
                    </p>
                  </div>
                  <div className="bg-blue-50 text-blue-600 p-2 rounded-lg">
                    <Tag className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center text-xs text-gray-500">
                  <Calendar className="w-3 h-3 mr-1" />
                  Hết hạn: {new Date(discount.expiryDate).toLocaleDateString("vi-VN")}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-white">
          <button
            onClick={onClose}
            className="w-full py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
      
      {/* Simple Animation Style */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default DiscountModal;