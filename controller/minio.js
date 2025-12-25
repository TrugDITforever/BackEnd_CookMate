const Minio = require("minio");

const dotenv = require("dotenv");
dotenv.config();

const minioClient = new Minio.Client({
  endPoint: "bp01se.stackhero-network.com",
  useSSL: true,
  accessKey: "erMPXxqtSI77eSTYBacF",
  secretKey: "XO5CciIPyhDoYEidS2q7gDnwcqyZN8g5B46bfjIz",
});

minioClient.listBuckets((err, buckets) => {
  if (err) {
    console.log("Lỗi kết nối MinIO:", err);
  } else {
    console.log("Danh sách Buckets:", buckets);
  }
});
module.exports = minioClient;
