// controller/review.js
const reviewModel = require("../model/reviewModel");
const foodModel = require("../model/foodModel");
const mongoose = require("mongoose");

// Thêm review mới
exports.createReview = async (req, res) => {
  try {
    const { foodId, userId, rating, comment } = req.body;

    // Kiểm tra xem user đã review món này chưa
    const existing = await reviewModel.findOne({ foodId, userId });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "Bạn đã review món này rồi" });
    }

    const review = await reviewModel.create({
      foodId,
      userId,
      rating,
      comment,
    });
    // Cập nhật lại avgRating và ratingCount trong foodModel
    const stats = await reviewModel.aggregate([
      { $match: { foodId: new mongoose.Types.ObjectId(foodId) } },
      {
        $group: {
          _id: "$foodId",
          avgRating: { $avg: "$rating" },
          ratingCount: { $sum: 1 },
        },
      },
    ]);

    if (stats.length > 0) {
      await foodModel.findByIdAndUpdate(foodId, {
        avgRating: stats[0].avgRating,
        ratingCount: stats[0].ratingCount,
      });
    }
    return res.status(201).json({
      success: true,
      data: review,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Lấy tất cả review theo recipe
exports.getReviewsByRecipe = async (req, res) => {
  try {
    const { foodId } = req.params;
    const reviews = await reviewModel
      .find({ foodId })
      .populate("userId", "_id name");
    res.status(200).json({ success: true, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteReview = async (req, res) => {
  const reviewId = req.params.reviewId;
  const userId = req.user.id; // đảm bảo middleware auth thêm `req.user`

  try {
    const review = await reviewModel.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Kiểm tra xem người dùng có phải chủ review không
    if (review.userId.toString() !== userId) {
      return res.status(403).json({ message: "Không có quyền xóa review này" });
    }

    await review.remove();

    res.status(200).json({ message: "Xóa review thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Xóa review
// exports.deleteReview = async (req, res) => {
//   try {
//     const { reviewId } = req.params;

//     const review = await reviewModel.findById(reviewId);
//     if (!review) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Review not found" });
//     }

//     // Chỉ cho phép xóa review của chính user
//     if (review.userId.toString() !== req.body.userId) {
//       return res
//         .status(403)
//         .json({ success: false, message: "Not authorized" });
//     }

//     await review.deleteOne();
//     res
//       .status(200)
//       .json({ success: true, message: "Review deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// Xóa review theo id
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await reviewModel.findByIdAndDelete(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
