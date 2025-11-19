const Minio = require("minio");

const dotenv = require("dotenv");
dotenv.config();

const minioClient = new Minio.Client({
  endPoint: "s3.manportfolio.id.vn",
  useSSL: true,
  accessKey: "hngBedbTC8i3dsXKuQGM",
  secretKey: "o3YFZGSgz9S3J39iYn14m3aDTe0CN1G7gbugcli4",
});

minioClient.listBuckets((err, buckets) => {
  if (err) {
    console.log("Lỗi kết nối MinIO:", err);
  } else {
    console.log("Danh sách Buckets:", buckets);
  }
});
module.exports = minioClient;
