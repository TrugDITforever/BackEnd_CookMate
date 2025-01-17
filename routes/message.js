const express = require("express");
const router = express.Router();
const controller = require("../controller/message");
router.post("/messages", controller.createMessage);
router.get("/messages", controller.getAllMessages);
router.get("/messages/conversation/:id", controller.getAllMessagesById);
router.put("/messages/:id", controller.updateMessage);
router.delete("/messages/:id", controller.deleteMessage);
module.exports = router;
