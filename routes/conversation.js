const express = require("express");
const router = express.Router();
const controller = require("../controller/conversation");
router.post("/conversations", controller.createConversation);
router.get("/conversations", controller.getAllConversations);
router.get(
  "/conversations/id/:conversationId",
  controller.getConversationsById
);
router.get("/conversations/user/:userId", controller.getConversationByUserId);
router.put("/conversations/:id", controller.updateConversation);
router.delete("/conversations/:id", controller.deleteConversation);
router.post("/conversations/fastCreate", controller.findOrCreateConversation);
module.exports = router;
