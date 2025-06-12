const express = require("express");
const userlog = require("../controller/logs");
const router = express.Router();
router.use(express.json());
//tracking user activity
router.post("/api/userLog", userlog.postUserLog);
module.exports = router;
