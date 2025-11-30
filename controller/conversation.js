const { default: mongoose } = require("mongoose");
const { ObjectId } = require("mongodb");

const conversationModel = require("../model/conversations");
const userModel = require("../model/userModel");

// rời nhóm
exports.leaveGroup = async (req, res) => {
  const { conversationId, userId } = req.body;

  try {
    const conversation = await conversationModel.findById(conversationId);

    if (!conversation || conversation.type !== "group") {
      return res
        .status(400)
        .json({ success: false, message: "Not a group chat" });
    }

    conversation.participants = conversation.participants.filter(
      (p) => String(p.userId) !== userId
    );

    await conversation.save();

    res.status(200).json({ success: true, message: "Left group successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// Xóa nhóm chung
exports.deleteGroup = async (req, res) => {
  const { conversationId, userId } = req.body;

  try {
    const conversation = await conversationModel.findById(conversationId);

    const isOwner = conversation.participants.some(
      (p) => String(p.userId) === userId && p.role === "owner"
    );

    if (!isOwner) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    await conversationModel.findByIdAndDelete(conversationId);

    res.status(200).json({ success: true, message: "Group deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// xóa private chat
exports.deletePrivate = async (req, res) => {
  const { id } = req.params;

  try {
    await conversationModel.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "Private chat deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createConversation = async (req, res) => {
  try {
    const { type, groupName, createdBy, participants } = req.body;

    const newConversation = await conversationModel.create({
      type: type,
      isGroup: true,
      groupName: groupName,
      createdBy: createdBy,
      participants: participants,
      lastActivityAt: new Date(),
    });

    res.status(200).json({ success: true, conversation: newConversation });
  } catch (error) {
    console.log("CREATE GROUP ERROR:", error); // <- IN LỖI RA
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllConversations = (req, res) => {
  try {
    conversationModel.find().then((conversations) => {
      res.status(200).json({ conversations: conversations, success: true });
    });
  } catch (error) {
    res.status(400).json({ error: "Can't fetch conversations" });
  }
};
exports.getConversationsById = async (req, res) => {
  const conversationId = req.params.conversationId;

  try {
    const conversation = await conversationModel
      .findOne({ _id: conversationId })
      .populate({
        path: "participants.userId",
        select: "_id name profileImage email username",
      })
      .populate({
        path: "lastMessage.senderId",
        select: "_id name profileImage username",
      });

    if (!conversation) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    res.status(200).json({ success: true, conversation });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getConversationByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;

    const conversations = await conversationModel
      .find({
        "participants.userId": userId,
      })
      .populate({
        path: "participants.userId",
        select: "_id name profileImage email username",
      })
      .sort({ lastActivityAt: -1 });

    res.status(200).json({ success: true, conversations });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.updateConversation = async (req, res) => {
  const conversationId = req.params.id;

  try {
    const updatedConversation = await conversationModel.findByIdAndUpdate(
      conversationId,
      req.body,
      { new: true }
    );

    if (!updatedConversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    res.status(200).json({ success: true, conversation: updatedConversation });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteConversation = (req, res) => {
  const conversationId = req.params.id;
  try {
    conversationModel
      .findByIdAndDelete(conversationId)
      .then((deletedConversation) => {
        if (deletedConversation) {
          res
            .status(200)
            .json({ message: "Conversation deleted", success: true });
        } else {
          res.status(404).json({ error: "Conversation not found" });
        }
      });
  } catch (error) {
    res.status(400).json({ error: "Can't delete conversation" });
  }
};

// Create private conversation if not exists
exports.findOrCreateConversation = async (req, res) => {
  const { userId, friendId } = req.body;

  try {
    // tìm private conversation giữa 2 người
    let conversation = await conversationModel.findOne({
      type: "private",
      participants: {
        $all: [
          { $elemMatch: { userId } },
          { $elemMatch: { userId: friendId } },
        ],
      },
    });

    if (!conversation) {
      conversation = await conversationModel.create({
        type: "private",
        isGroup: false,
        participants: [
          { userId, role: "member" },
          { userId: friendId, role: "member" },
        ],
        lastActivityAt: new Date(),
      });
    }

    res.status(200).json({
      success: true,
      conversationId: conversation._id,
    });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
