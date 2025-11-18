const express = require("express");
const router = express.Router();
const friendRequestController = require("../controller/friendrequest");

// Tạo yêu cầu kết bạn
router.post("/friendRequests", friendRequestController.createFriendRequest);

// Lấy tất cả yêu cầu kết bạn
router.get(
  "/friendRequests/user/:id",
  friendRequestController.getAllFriendRequests
);

// Lấy yêu cầu kết bạn theo id
router.get("/friendRequests/:id", friendRequestController.getFriendRequestById);

// Cập nhật yêu cầu kết bạn (chấp nhận hoặc từ chối)
router.put("/friendRequests/:id", friendRequestController.updateFriendRequest);

// Chấp nhận lời mời kết bạn
router.put(
  "/friendRequests/accept/:requestId",
  friendRequestController.acceptFriendRequest
);

// Từ chối lời mời kết bạn
router.put(
  "/friendRequests/reject/:id",
  friendRequestController.rejectFriendRequest
);

// Kiểm tra yêu cầu kết bạn
router.get(
  "/friendRequests/check/:receiverId",
  friendRequestController.checkCreateFriendRequest
);

// Xóa yêu cầu kết bạn
router.delete(
  "/friendRequests/:id",
  friendRequestController.deleteFriendRequest
);

module.exports = router;
