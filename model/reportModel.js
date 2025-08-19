const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", // tham chiếu đến User
      required: true,
    },
    foodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "foods", // tham chiếu đến Food
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

// 👇 Thêm index để đảm bảo không trùng lặp
reportSchema.index({ reporterId: 1, foodId: 1 }, { unique: true });

const reportModel = mongoose.model("reports", reportSchema);
module.exports = reportModel;
