const Report = require("../model/reportModel");

// Tạo report
exports.createReport = async (req, res) => {
  try {
    const { reporterId, foodId, reason } = req.body;

    if (!reporterId || !foodId || !reason) {
      return res
        .status(400)
        .json({ success: false, message: "Missing fields" });
    }

    console.log("📌 req.body:", req.body); // log toàn bộ body để debug

    // Kiểm tra thiếu field nào
    if (!foodId) {
      return res.json({ success: false, message: "Missing foodId" });
    }
    if (!reporterId) {
      return res.json({ success: false, message: "Missing reporterId" });
    }
    if (!reason) {
      return res.json({ success: false, message: "Missing reason" });
    }

    // Kiểm tra nếu report này đã tồn tại
    const existingReport = await Report.findOne({ reporterId, foodId });

    if (existingReport) {
      return res.status(400).json({
        success: false,
        message: "You have already report this recipe.",
      });
    }

    const report = new Report({ reporterId, foodId, reason });
    await report.save();

    res.json({ success: true, data: report });
  } catch (err) {
    console.error("Error creating report:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Lấy danh sách report (ví dụ chỉ admin mới dùng)
exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("reporterId", "name email")
      .populate("foodId", "foodName");
    res.json({ success: true, data: reports });
  } catch (err) {
    console.error("Error fetching reports:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Xóa report (tuỳ theo quyền admin)
exports.deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Report.findByIdAndDelete(id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Report not found" });
    }
    res.json({ success: true, message: "Report deleted" });
  } catch (err) {
    console.error("Error deleting report:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET: Lấy tất cả report của 1 món ăn
exports.getReportsByFood = async (req, res) => {
  try {
    const { foodId } = req.params;
    const reports = await Report.find({ foodId })
      .populate("reporterId", "name email")
      .populate("foodId", "foodName");

    res.json({ success: true, data: reports });
  } catch (err) {
    console.error("Error fetching reports by foodId:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const deleteReportGroup = async (groupId) => {
  try {
    // Bước 1: Tìm tất cả report thuộc group
    const reports = await Report.find({ group_id: groupId });

    // Bước 2: Xóa từng report
    for (const report of reports) {
      await Report.findByIdAndDelete(report._id);
    }

    // Bước 3: Xóa group
    await ReportGroup.findByIdAndDelete(groupId);

    console.log("Xóa thành công tất cả report và group.");
  } catch (error) {
    console.error("Lỗi khi xóa report group:", error);
  }
};

// DELETE: Xóa tất cả report liên quan đến một foodId
exports.deleteReportsByFoodId = async (req, res) => {
  try {
    const { foodId } = req.params;
    const result = await Report.deleteMany({ foodId });

    res.json({
      success: true,
      message: `Đã xoá ${result.deletedCount} báo cáo liên quan đến món ăn.`,
    });
  } catch (err) {
    console.error("Error deleting reports by foodId:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
