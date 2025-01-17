const { default: mongoose } = require("mongoose");
const { ObjectId } = require("mongodb");

const conversationModel = require("../model/conversations");
exports.createConversation = (req, res) => {
  const state = req.body;
  const newConversation = new conversationModel({
    participants: state.participants,
    isGroup: state.isGroup,
    groupAdmin: state.isGroup ? state.groupAdmin : null,
    groupName: state.groupName,
    lastMessage: state.lastMessage,
  });

  try {
    newConversation.save().then((savedConversation) => {
      res.status(200).json({ conversation: savedConversation, success: true });
    });
  } catch (error) {
    res.status(400).json({ error: "Can't create conversation" });
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
exports.getConversationsById = (req, res) => {
  const conversationId = req.params.conversationId;
  try {
    conversationModel.findOne({ _id: conversationId }).then((conversations) => {
      res.status(200).json({ conversations: conversations, success: true });
    });
  } catch (error) {
    res.status(400).json({ error: "Can't fetch conversations" });
  }
};
exports.getConversationByUserId = (req, res) => {
  const userId = req.params.userId;
  try {
    conversationModel.find({ participants: userId }).then((conversations) => {
      res.status(200).json({ conversations: conversations, success: true });
    });
  } catch (error) {
    res.status(400).json({ error: "Can't fetch conversations" });
  }
};
exports.updateConversation = (req, res) => {
  const conversationId = req.params.id;
  const updatedData = req.body;
  try {
    conversationModel
      .findOneAndUpdate({ id: conversationId }, updatedData, { new: true })
      .then((updatedConversation) => {
        if (updatedConversation) {
          res
            .status(200)
            .json({ conversation: updatedConversation, success: true });
        } else {
          res.status(404).json({ error: "Conversation not found" });
        }
      });
  } catch (error) {
    res.status(400).json({ error: "Can't update conversation" });
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

exports.findOrCreateConversation = async (req, res) => {
  const { userId, friendId, name } = req.body;
  console.log(friendId);
  try {
    let conversation = await conversationModel.findOne({
      participants: { $all: [userId, friendId] },
    });

    if (!conversation) {
      conversation = new conversationModel({
        participants: [userId, friendId],
        groupName: name,
        lastMessage: null,
        updatedAt: new Date(),
      });
      await conversation.save();
    }

    res.status(200).json({ conversationId: conversation._id });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error finding or creating conversation", error });
  }
};
