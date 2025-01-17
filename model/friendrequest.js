const mongoose = require("mongoose");
const friendRequestSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // ID của người gửi yêu cầu kết bạn
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // ID của người nhận yêu cầu kết bạn
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  }, // Trạng thái yêu cầu kết bạn
  requestedAt: {
    type: Date,
    default: Date.now,
  }, // Thời gian gửi yêu cầu
  respondedAt: {
    type: Date,
  }, // Thời gian phản hồi yêu cầu (chấp nhận hoặc từ chối)
});

const FriendRequest = mongoose.model("friendrequests", friendRequestSchema);

module.exports = FriendRequest;
