const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    id: String,
    participants: [mongoose.Schema.Types.ObjectId],
    isGroup: { type: Boolean, default: false },
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      required: function () {
        return this.isGroup;
      },
    },
    groupName: { type: String, default: null },
    lastMessage: { type: String, ref: "messages" },
  },
  { timestamps: true }
);

const conversationModel = mongoose.model("conversations", conversationSchema);

module.exports = conversationModel;
