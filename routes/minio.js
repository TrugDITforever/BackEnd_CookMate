// routes/minioRoutes.js
const express = require("express");
const router = express.Router();
const minioClient = require("../controller/minio");

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() }); // Lưu file vào bộ nhớ tạm thời (Buffer)

router.post("/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  const fileName = `${Date.now()}_${file.originalname}`;

  minioClient.putObject("cookmate", fileName, file.buffer, (err, etag) => {
    if (err) {
      return res
        .status(500)
        .json({ error: err.message || "Internal Server Error" });
    }
    res.status(200).json({ message: "File uploaded successfully", fileName });
  });
});

router.get("/file/:fileName", (req, res) => {
  const { fileName } = req.params;

  minioClient.presignedGetObject(
    "cookmate",
    fileName,
    24 * 60 * 60,
    (err, url) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json({ url });
    }
  );
});
router.get("/test-minio", async (req, res) => {
  try {
    // Kiểm tra kết nối bằng cách gọi bucketExists
    const exists = await minioClient.bucketExists("cookmate");
    res
      .status(200)
      .json({ message: "Kết nối thành công!", bucketExists: exists });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi kết nối MinIO", error: error.message });
  }
});
module.exports = router;
