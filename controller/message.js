const messageModel = require("../model/messages");

exports.createMessage = (req, res) => {
  const state = req.body;
  const newMessage = new messageModel({
    conversationId: state.conversationId,
    senderId: state.senderId,
    text: state.text,
    createdAt: new Date(),
  });

  try {
    newMessage.save().then((savedMessage) => {
      res.status(200).json({ message: savedMessage, success: true });
    });
  } catch (error) {
    res.status(400).json({ error: "Can't create message" });
  }
};
exports.getAllMessages = (req, res) => {
  try {
    messageModel.find().then((messages) => {
      res.status(200).json({ messages: messages, success: true });
    });
  } catch (error) {
    res.status(400).json({ error: "Can't fetch messages" });
  }
};
exports.getAllMessagesById = (req, res) => {
  const conversationId = req.params.id;
  try {
    messageModel.find({ conversationId: conversationId }).then((messages) => {
      res.status(200).json({ messages: messages, success: true });
    });
  } catch (error) {
    res.status(400).json({ error: "Can't fetch messages" });
  }
};
exports.updateMessage = (req, res) => {
  const messageId = req.params.id;
  const updatedData = req.body;

  try {
    messageModel
      .findOneAndUpdate({ id: messageId }, updatedData, { new: true })
      .then((updatedMessage) => {
        if (updatedMessage) {
          res.status(200).json({ message: updatedMessage, success: true });
        } else {
          res.status(404).json({ error: "Message not found" });
        }
      });
  } catch (error) {
    res.status(400).json({ error: "Can't update message" });
  }
};
exports.deleteMessage = (req, res) => {
  const messageId = req.params.id;

  try {
    messageModel.findOneAndDelete({ id: messageId }).then((deletedMessage) => {
      if (deletedMessage) {
        res.status(200).json({ message: "Message deleted", success: true });
      } else {
        res.status(404).json({ error: "Message not found" });
      }
    });
  } catch (error) {
    res.status(400).json({ error: "Can't delete message" });
  }
};
