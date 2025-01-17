const Minio = require("minio");

const dotenv = require("dotenv");
dotenv.config();

const minioClient = new Minio.Client({
  endPoint: "minio.manportfolio.id.vn",
  useSSL: true,
  accessKey: "RapRSa9y0byhXHmfhWYd",
  secretKey: "VSE88BczrJuSBRhSFtuEiPaOjdrCtdrp90mekHme",
});

minioClient.listBuckets((err, buckets) => {
  if (err) {
    console.log("Lỗi kết nối MinIO:", err);
  } else {
    console.log("Danh sách Buckets:", buckets);
  }
});
module.exports = minioClient;
