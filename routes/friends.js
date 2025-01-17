const express = require("express");
const router = express.Router();
const friendController = require("../controller/friend");

// Thêm bạn bè
router.post("/friends", friendController.addFriend);

// Lấy danh sách bạn bè
router.get("/friends/:id", friendController.getAllFriends);

// Lấy thông tin chi tiết bạn bè theo userId
// router.get("/friends/:id", friendController.getFriendById);

// Cập nhật bạn bè
router.put("/friends/:id", friendController.updateFriend);

// Xóa bạn bè
router.delete("/friends/:id", friendController.deleteFriend);

module.exports = router;
