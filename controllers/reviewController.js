const Product = require('../models/productModel')
const Review = require('../models/reviewModel')

const createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    if (!rating || !productId) {
      return res.status(400).json({ message: "Rating and productId are required." });
    }

    const review = new Review({
      userId: req.user._id,
      productId,
      rating,
      comment,
    });

    const savedReview = await review.save();

    res.status(201).json({ success: true, review: savedReview });
  } catch (error) {
    console.error("Create review error:", error);
    res.status(500).json({ success: false, message: "Failed to create review" });
  }
};

// 2. Get All Reviews of a Product
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ productId }).populate("userId", "name");

    res.status(200).json({ success: true, reviews });
  } catch (error) {
    console.error("Fetch product reviews error:", error);
    res.status(500).json({ success: false, message: "Failed to get reviews" });
  }
};

// 3. Get All Reviews by Logged-in User
const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.user._id }).populate("productId", "title");

    res.status(200).json({ success: true, reviews });
  } catch (error) {
    console.error("Fetch user reviews error:", error);
    res.status(500).json({ success: false, message: "Failed to get your reviews" });
  }
};

// 4. Update a Review
const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findOne({ _id: reviewId, userId: req.user._id });

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found or unauthorized" });
    }

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;

    const updated = await review.save();

    res.status(200).json({ success: true, review: updated });
  } catch (error) {
    console.error("Update review error:", error);
    res.status(500).json({ success: false, message: "Failed to update review" });
  }
};

// 5. Delete a Review
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findOneAndDelete({ _id: reviewId, userId: req.user._id });

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found or unauthorized" });
    }

    res.status(200).json({ success: true, message: "Review deleted" });
  } catch (error) {
    console.error("Delete review error:", error);
    res.status(500).json({ success: false, message: "Failed to delete review" });
  }
};
module.exports = {createReview,getProductReviews,getMyReviews,updateReview,deleteReview,};