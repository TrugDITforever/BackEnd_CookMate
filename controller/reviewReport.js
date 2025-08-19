const ReviewReport = require("../model/reviewReportModel");
const Review = require("../model/reviewModel");

// POST: tạo report review
exports.createReviewReport = async (req, res) => {
  try {
    const { reporterId, reviewId, reason } = req.body;

    if (!reporterId || !reviewId || !reason) {
      return res
        .status(400)
        .json({ success: false, message: "Missing fields" });
    }

    const existingReport = await ReviewReport.findOne({ reporterId, reviewId });
    if (existingReport) {
      return res.status(400).json({
        success: false,
        message: "You have already reported this review.",
      });
    }

    const report = new ReviewReport({ reporterId, reviewId, reason });
    await report.save();

    res.json({ success: true, data: report });
  } catch (err) {
    console.error("Error creating review report:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET: lấy tất cả report
exports.getReviewReports = async (req, res) => {
  try {
    const reports = await ReviewReport.find()
      .populate("reporterId", "name email")
      .populate("reviewId", "comment rating");

    res.json({ success: true, data: reports });
  } catch (err) {
    console.error("Error fetching review reports:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET: lấy tất cả report theo reviewId
exports.getReportsByReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const reports = await ReviewReport.find({ reviewId })
      .populate("reporterId", "name email")
      .populate("reviewId", "comment rating");

    res.json({ success: true, data: reports });
  } catch (err) {
    console.error("Error fetching reports by reviewId:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE: xoá 1 report
exports.deleteReviewReport = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ReviewReport.findByIdAndDelete(id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Report not found" });
    }
    res.json({ success: true, message: "Report deleted" });
  } catch (err) {
    console.error("Error deleting review report:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE: xoá tất cả report liên quan đến reviewId
exports.deleteReportsByReviewId = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const result = await ReviewReport.deleteMany({ reviewId });

    res.json({
      success: true,
      message: `Đã xoá ${result.deletedCount} báo cáo liên quan đến review.`,
    });
  } catch (err) {
    console.error("Error deleting reports by reviewId:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.deleteReviewReported = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const deleted = await Review.findByIdAndDelete(reviewId);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    // Dọn toàn bộ report liên quan review này
    await ReviewReport.deleteMany({ reviewId });

    return res.json({ success: true, message: "Review deleted" });
  } catch (err) {
    console.error("Error deleting review:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
