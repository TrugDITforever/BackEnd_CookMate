const express = require("express");
const router = express.Router();
const reportController = require("../controller/report");

// POST: tạo report
router.post("/report", reportController.createReport);

// GET: lấy tất cả report
router.get("/report", reportController.getReports);

// DELETE: xoá report theo id
router.delete("/report/:id", reportController.deleteReport);

router.get("/report/food/:foodId", reportController.getReportsByFood);

// router.delete("report/delete-by-recipe/:recipeId", deleteReportsByRecipeId);
router.delete(
  "/report/delete-by-food/:foodId",
  reportController.deleteReportsByFoodId
);

module.exports = router;
