const mongoose = require("mongoose");

const friendSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // ID của người dùng
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ], // Mảng chứa ID của bạn bè
  addedAt: {
    type: Date,
    default: Date.now,
  }, // Ngày kết bạn
}); 

const Friend = mongoose.model("friends", friendSchema);

module.exports = Friend;
