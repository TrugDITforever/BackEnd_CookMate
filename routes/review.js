// routes/review.js
const express = require("express");
const router = express.Router();
const reviewController = require("../controller/review");

// POST /api/review
router.post("/review", reviewController.createReview);

// GET /api/review/:recipeId
router.get("/review/:foodId", reviewController.getReviewsByRecipe);

// DELETE /api/review/:reviewId
// router.delete("/review/:reviewId", reviewController.deleteReview);
router.delete("/review/:reviewId", reviewController.deleteReview);

// DELETE: xoá review (và các report của nó sẽ bị xoá trong controller)
// router.delete("/review/:id", reviewController.deleteReview);

module.exports = router;