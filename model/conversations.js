const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    // 1. Loại cuộc trò chuyện: private hoặc group
    type: {
      type: String,
      enum: ["private", "group"],
      default: "private",
    },

    // 2. Danh sách người tham gia
    participants: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
        role: {
          type: String,
          enum: ["member", "admin", "owner"],
          default: "member",
        },
        joinedAt: { type: Date, default: Date.now },
      },
    ],
    isGroup: { type: Boolean, default: false },
    // 3. THÔNG TIN NHÓM
    groupName: { type: String, default: null },
    groupAvatar: { type: String, default: null },
    groupDescription: { type: String, default: "" },

    // 4. Người tạo nhóm
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: function () {
        return this.type === "group";
      },
    },

    // 5. Tin nhắn cuối cùng để hiển thị preview
    lastMessage: {
      messageId: { type: mongoose.Schema.Types.ObjectId, ref: "messages" },
      text: { type: String },
      createdAt: { type: Date },
      senderId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    },

    // 6. Dùng cho sorting hiển thị
    lastActivityAt: { type: Date, default: Date.now },

    // 7. Các tùy chọn nâng cao
    isMuted: {
      type: Map,
      of: Boolean, // key: userId, value: true/false
      default: {},
    },

    unreadCount: {
      type: Map,
      of: Number, // key: userId
      default: {},
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("conversations", conversationSchema);
