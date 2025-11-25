import React, { useState, useEffect, useContext } from "react";
import { Star, User, ChevronLeft, ChevronRight } from "lucide-react";
import axiosClient from "../../api/axiosClient";
import { AuthContext } from "../../context/AuthContext";

const ITEMS_PER_PAGE = 5; // Number of reviews per page

const ProductReviews = ({ productId }) => {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  // Form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [guestName, setGuestName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const res = await axiosClient.get(`/reviews/${productId}`);
      setReviews(res.data);
      setCurrentPage(1); // Reset to page 1 when new reviews load
    } catch (err) {
      console.error("Failed to load reviews", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await axiosClient.post("/reviews", {
        productId,
        rating: user ? rating : undefined, // Send undefined for guests to skip enum check
        comment,
        guest_name: user ? undefined : guestName
      });
      
      // Reset form and reload reviews
      setComment("");
      setRating(5);
      if (!user) setGuestName("");
      fetchReviews();
      
    } catch (err) {
      alert(err.response?.data?.error || "Lỗi khi gửi đánh giá");
    } finally {
      setSubmitting(false);
    }
  };

  // --- PAGINATION LOGIC ---
  const totalPages = Math.ceil(reviews.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentReviews = reviews.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const renderStars = (score) => {
    if (!score) return null; 
    return (
      <div className="flex text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={14} fill={i < score ? "currentColor" : "none"} className={i < score ? "" : "text-gray-300"} />
        ))}
      </div>
    );
  };

  return (
    <div className="mt-12 border-t pt-8" id="reviews-header">

      {/* Review Form */}
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Viết đánh giá</h3>
        <form onSubmit={handleSubmit}>
          
          {!user && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên hiển thị</label>
              <input
                type="text"
                required
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="Nhập tên bạn muốn hiển thị"
              />
            </div>
          )}

          {user ? (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Đánh giá sao</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`transition-transform hover:scale-110 ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
                  >
                    <Star size={24} fill="currentColor" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mb-4 p-3 bg-blue-50 text-blue-700 text-sm rounded-md border border-blue-100 flex items-start gap-2">
              <User size={16} className="mt-0.5 shrink-0" />
              <span>Bạn đang bình luận với tư cách là <strong>Khách</strong> (không thể đánh giá sao). <a href="/login" className="underline font-semibold hover:text-blue-800">Đăng nhập</a> để đánh giá đầy đủ.</span>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung</label>
            <textarea
              required
              rows="3"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition resize-none"
              placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium w-full sm:w-auto"
          >
            {submitting ? "Đang gửi..." : "Gửi đánh giá"}
          </button>
        </form>
      </div>

      <h2 className="text-2xl font-bold mb-6">
        Đánh giá sản phẩm <span className="text-gray-500 text-lg font-normal">({reviews.length})</span>
      </h2>

      {/* Reviews List */}
      <div className="space-y-6 mb-10">
        {loading ? (
          <div className="space-y-4">
             {[1,2,3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />)}
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-gray-500 italic text-center py-8">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
        ) : (
          <>
            {currentReviews.map((rev) => (
              <div key={rev._id} className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm transition hover:shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-gray-100 p-2 rounded-full">
                      <User size={16} className="text-gray-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-800">{rev.author}</span>
                        {!rev.rating && <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-500 font-medium">Khách</span>}
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(rev.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </div>
                  {rev.rating && <div className="mb-2">{renderStars(rev.rating)}</div>}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mt-2">{rev.comment}</p>
              </div>
            ))}

            {/* PAGINATION CONTROLS */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8 pt-4 border-t border-dashed border-gray-200">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft size={20} />
                </button>
                
                <span className="text-sm font-medium text-gray-600">
                  Trang {currentPage} / {totalPages}
                </span>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

    </div>
  );
};

export default ProductReviews;