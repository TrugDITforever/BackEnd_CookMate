const mongoose = require("mongoose");

const messagesSchema = new mongoose.Schema(
  {
    conversationId: String,
    senderId: String,
    text: String,
    image: String,
    postId: String,
    createdAt: Date,
  },
  { timestamps: true },
);
const messageModel = new mongoose.model("messages", messagesSchema);
module.exports = messageModel;
