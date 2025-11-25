import Review from "../models/reviewModel.js";
import User from "../models/userModel.js";

// Get reviews for a specific product
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const reviews = await Review.find({ product_id: productId })
      .populate("user_id", "fullName") // Get user name if logged in
      .sort({ createdAt: -1 }); // Newest first

    // Format the response so frontend gets a consistent "author" name
    const formattedReviews = reviews.map(review => ({
      _id: review._id,
      rating: review.rating,
      comment: review.comment,
      author: review.user_id ? review.user_id.fullName : (review.guest_name || "Khách"),
      createdAt: review.createdAt
    }));

    res.json(formattedReviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a review
export const createReview = async (req, res) => {
  try {
    const { productId, rating, comment, guest_name } = req.body;
    
    let reviewData = {
      product_id: productId,
      comment,
      guest_name
    };

    if (req.user) {
      // User is logged in
      reviewData.user_id = req.user.id;
      reviewData.rating = rating; // Users can rate
    } else {
      // Guest user
      reviewData.user_id = null;
      reviewData.rating = null; // Guests CANNOT rate (enforced by Model too)
    }

    const newReview = new Review(reviewData);
    await newReview.save();

    res.status(201).json(newReview);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};