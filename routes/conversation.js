const express = require("express");
const router = express.Router();
const controller = require("../controller/conversation");
router.post("/conversations", controller.createConversation);
router.post("/conversations/leave", controller.leaveGroup);
router.post("/conversations/fastCreate", controller.findOrCreateConversation);
router.post("/conversations/deleteGroup", controller.deleteGroup);

router.get("/conversations", controller.getAllConversations);
router.get(
  "/conversations/id/:conversationId",
  controller.getConversationsById
);
router.get("/conversations/user/:userId", controller.getConversationByUserId);
router.put("/conversations/:id", controller.updateConversation);
router.delete("/conversations/:id", controller.deletePrivate);
module.exports = router;
