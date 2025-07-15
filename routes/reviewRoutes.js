const express = require("express");
const {createReview,getProductReviews,getMyReviews,updateReview,deleteReview,} = require("../controllers/reviewController");
const authUser = require('../middlewares/authUser')

const router = express.Router();

// Public: Get all reviews for a product
router.get("/:productId", getProductReviews);

// Protected Routes
router.post("/", authUser, createReview);
router.get("/", authUser, getMyReviews);
router.put("/:reviewId", authUser, updateReview);
router.delete("/:reviewId", authUser, deleteReview);

module.exports = router;
