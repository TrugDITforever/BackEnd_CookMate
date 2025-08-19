const mongoose = require("mongoose");

const reviewReportSchema = new mongoose.Schema(
  {
    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    reviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "reviews",
      required: true,
    },
    reason: {
      type: String,
      required: true,
      enum: [
        "Spam or misleading",
        "Inappropriate content",
        "Copyright infringement",
        "Hate speech",
        "Other",
      ],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

// 👇 Không cho một user report trùng review 2 lần
reviewReportSchema.index({ reporterId: 1, reviewId: 1 }, { unique: true });

const ReviewReport = mongoose.model("reviewReports", reviewReportSchema);
module.exports = ReviewReport;
