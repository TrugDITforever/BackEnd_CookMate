const express = require("express");
const router = express.Router();
const reviewReportController = require("../controller/reviewReport");

// POST: tạo report
router.post("/review-report", reviewReportController.createReviewReport);

// GET: lấy tất cả report
router.get("/review-report", reviewReportController.getReviewReports);

// GET: lấy tất cả report của 1 review
router.get(
  "/review-report/review/:reviewId",
  reviewReportController.getReportsByReview
);

// DELETE: xoá report theo id
router.delete("/review-report/:id", reviewReportController.deleteReviewReport);

// DELETE: xoá tất cả report của 1 review
// router.delete(
//   "/review-report/delete-by-review/:reviewId",
//   reviewReportController.deleteReportsByReviewId
// );

router.delete(
  "/review-report/delete-by-review/:reviewId",
  reviewReportController.deleteReviewReported
);

module.exports = router;
