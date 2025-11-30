// const { Server } = require("socket.io");
// const messageModel = require("../model/messages");
// const conversationModel = require("../model/conversations");

// const { text } = require("express");

// // function getlistofGroupmember
// async function getGroupMember(conversationId) {
//   try {
//     const result = await conversationModel.findOne({ _id: conversationId });
//     return result?.participants;
//   } catch (error) {
//     console.error("Error fetching group members:", error);
//     return null;
//   }
// }
// async function CreateNewMess(newMessage) {
//   try {
//     const newmessage = await newMessage.save();
//     return newmessage;
//   } catch (error) {
//     return;
//   }
// }
// const socketSetup = (server) => {
//   const io = new Server(server, {
//     cors: {
//       origin: "*",
//       methods: ["GET", "POST"],
//     },
//   });

//   const users = {};

//   io.on("connection", (socket) => {
//     socket.on("user", (userId, conversationId) => {
//       socket.join(conversationId);
//       if (!users[conversationId]) {
//         users[conversationId] = new Map();
//       }
//       users[conversationId].set(userId, socket.id);
//       console.log(`User ${userId} connected to conversation ${conversationId}`);
//     });
//     socket.emit("statusUpdate", { userId: socket.id, status: true });
//     socket.on("send_message", async (data) => {
//       const { from, content, to, conversationId, isGroup, type } = data;
//       if (type === "image") {
//         const newMessage = new messageModel({
//           conversationId: conversationId,
//           senderId: from,
//           image: content,
//           type: "image",
//         });

//         if (!isGroup) {
//           const newMess = await CreateNewMess(newMessage);
//           let recipientSocketId;
//           to.forEach((value) => {
//             recipientSocketId = users[conversationId]?.get(value);
//           });

//           if (recipientSocketId) {
//             io.to(conversationId).emit("send_message", {
//               _id: newMess._id,
//               image: content,
//               from: from,
//               to: to,
//               conversationId: conversationId,
//               createdAt: new Date(),
//               type: "image",
//             });
//           } else {
//             console.log("Recipient user not connected or invalid ID.");
//           }
//         } else {
//           const newMess = await CreateNewMess(newMessage);
//           to.forEach((memberId) => {
//             const newrecipientSocketId = users[conversationId]?.get(memberId);
//             if (memberId !== from && newrecipientSocketId) {
//               io.to(newrecipientSocketId).emit("send_message", {
//                 _id: newMess._id,
//                 image: content,
//                 from: from,
//                 to: memberId,
//                 conversationId: conversationId,
//                 createdAt: new Date(),
//                 type: "image",
//               });
//             }
//           });
//         }
//       } else if (type === "text") {
//         const newMessage = new messageModel({
//           conversationId: conversationId,
//           senderId: from,
//           text: content,
//         });
//         if (!isGroup) {
//           const newMess = await CreateNewMess(newMessage);
//           let recipientSocketId;
//           to.forEach((value) => {
//             recipientSocketId = users[conversationId]?.get(value);
//           });
//           if (recipientSocketId) {
//             io.to(conversationId).emit("send_message", {
//               _id: newMess._id,
//               text: content,
//               from: from,
//               conversationId: conversationId,
//               createdAt: new Date(),
//               type: type,
//             });
//           } else {
//             console.log("Recipient user not connected or invalid ID.");
//           }
//         } else {
//           const newMess = await CreateNewMess(newMessage);
//           to.forEach((memberId) => {
//             const newrecipientSocketId = users[conversationId]?.get(memberId);
//             if (memberId !== from && newrecipientSocketId) {
//               io.to(newrecipientSocketId).emit("send_message", {
//                 _id: newMess._id,
//                 text: content,
//                 from: from,
//                 conversationId: conversationId,
//                 createdAt: new Date(),
//                 type: type,
//               });
//             }
//           });
//         }
//       } else {
//         console.log("Invalid message type");
//       }
//     });
//     socket.on(
//       "delete_message",
//       async ({ messageId, conversationId, isGroup }) => {
//         // console.log(messageId);
//         try {
//           await messageModel.findByIdAndDelete(messageId);

//           if (!isGroup) {
//             const participants = await getGroupMember(conversationId);
//             participants?.forEach((participantId) => {
//               const recipientSocketId =
//                 users[conversationId]?.get(participantId);
//               if (recipientSocketId) {
//                 io.to(recipientSocketId).emit("message_deleted", { messageId });
//               }
//             });
//           } else {
//             const participants = await getGroupMember(conversationId);
//             participants?.forEach((participantId) => {
//               const recipientSocketId =
//                 users[conversationId]?.get(participantId);
//               if (recipientSocketId) {
//                 io.to(recipientSocketId).emit("message_deleted", { messageId });
//               }
//             });
//           }
//         } catch (error) {
//           console.error("Error deleting message:", error);
//         }
//       }
//     );
//     /// video call
//     // socket.on("joinRoom", (userId, conversationId) => {
//     //   // Thêm người dùng vào phòng cụ thể
//     //   if (!users[conversationId]) {
//     //     users[conversationId] = new Map();
//     //   }
//     //   users[conversationId].set(userId, socket.id);

//     //   // Tham gia phòng của Socket.IO
//     //   socket.join(conversationId);
//     //   // console.log(`User ${userId} joined room ${conversationId}`);

//     //   // Phát sóng tới các thành viên khác trong phòng
//     //   socket.to(conversationId).emit("userJoined", {
//     //     userId,
//     //     message: `User ${userId} has joined the room.`,
//     //   });

//     //   // Gửi danh sách người dùng hiện tại trong phòng cho người dùng mới
//     //   const currentUsers = Array.from(users[conversationId].keys());
//     //   console.log(`User ${currentUsers} has joined the room`);
//     //   io.to(conversationId).emit("currentUsers", { users: currentUsers });
//     // });
//     // socket.on("offer", (offer) => {
//     //   console.log(`User ${offer} has joined the room`);
//     //   socket.broadcast.emit("offer", offer);
//     // });

//     // socket.on("answer", (answer) => {
//     //   socket.broadcast.emit("answer", answer);
//     // });

//     // socket.on("ice-candidate", (candidate) => {
//     //   socket.broadcast.emit("ice-candidate", candidate);
//     // });
//     // socket.on("random", () => {
//     //   console.log("hihihihi");
//     // });
//     // socket.on("leaveRoom", (userId, conversationId) => {
//     //   if (users[conversationId]) {
//     //     users[conversationId].delete(userId);
//     //     socket.leave(conversationId);
//     //     console.log(`User ${userId} left room ${conversationId}`);

//     //     // Phát sóng thông báo rời phòng đến các thành viên còn lại
//     //     socket.to(conversationId).emit("userLeft", {
//     //       userId,
//     //       message: `User ${userId} has left the room.`,
//     //     });

//     //     // Cập nhật số lượng người dùng trong phòng
//     //     const currentUsers = Array.from(users[conversationId].keys());
//     //     io.to(conversationId).emit("currentUsers", {
//     //       users: currentUsers,
//     //     });

//     //     if (currentUsers.length === 0) {
//     //       delete users[conversationId];
//     //     }
//     //   }
//     // });
//     // socket.on("endCall", () => {
//     //   console.log(`Call ended by user: ${socket.id}`);
//     //   socket.broadcast.emit("callEnded");
//     // });
//     socket.on("disconnect", () => {
//       console.log("A user disconnected:", socket.id);

//       for (let userId in users) {
//         if (users[userId] === socket.id) {
//           delete users[userId];
//           break;
//         }
//       }
//     });
//   });

//   return io;
// };

// module.exports = socketSetup;
const { Server } = require("socket.io");
const messageModel = require("../model/messages");
const conversationModel = require("../model/conversations");

async function getGroupMember(conversationId) {
  try {
    const result = await conversationModel.findOne({ _id: conversationId });
    return result?.participants;
  } catch (err) {
    console.error("Error fetching group members:", err);
    return [];
  }
}

async function CreateNewMess(newMessage) {
  try {
    return await newMessage.save();
  } catch (err) {
    console.error("Error creating message:", err);
    return null;
  }
}

const socketSetup = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 Socket connected:", socket.id);

    // ==============================
    // USER JOIN A CONVERSATION ROOM
    // ==============================
    socket.on("user", (userId, conversationId) => {
      socket.join(conversationId);
      console.log(`👤 User ${userId} joined room: ${conversationId}`);
    });

    socket.emit("statusUpdate", { userId: socket.id, status: true });

    // ==============================
    // SEND MESSAGE (TEXT / IMAGE)
    // ==============================
    socket.on("send_message", async (data) => {
      const { from, content, conversationId, type } = data;

      const newMessage =
        type === "image"
          ? new messageModel({
              conversationId,
              senderId: from,
              image: content,
              type: "image",
            })
          : new messageModel({
              conversationId,
              senderId: from,
              text: content,
              type: "text",
            });

      const saved = await CreateNewMess(newMessage);
      if (!saved) return;

      const payload = {
        _id: saved._id,
        from,
        conversationId,
        createdAt: new Date(),
        type,
      };

      if (type === "image") payload.image = content;
      if (type === "text") payload.text = content;

      // Broadcast to everyone in room
      io.to(conversationId).emit("send_message", payload);

      console.log(`💬 Message sent to room ${conversationId}`);
    });

    // ==============================
    // DELETE MESSAGE
    // ==============================
    socket.on("delete_message", async ({ messageId, conversationId }) => {
      try {
        await messageModel.findByIdAndDelete(messageId);

        io.to(conversationId).emit("message_deleted", { messageId });

        console.log(
          `🧹 Message ${messageId} deleted in room ${conversationId}`
        );
      } catch (err) {
        console.error("Error deleting message:", err);
      }
    });

    // ==============================
    // VIDEO CALL EVENTS (OFFER / ANSWER / CANDIDATE)
    // ==============================
    socket.on("joinRoom", (userId, conversationId) => {
      socket.join(conversationId);
      console.log(`📞 Video user ${userId} joined call room ${conversationId}`);

      socket.to(conversationId).emit("userJoined", { userId });

      const clients = Array.from(
        io.sockets.adapter.rooms.get(conversationId) || []
      );
      io.to(conversationId).emit("currentUsers", { users: clients });
    });

    socket.on("offer", (data) => {
      socket.to(data.conversationId).emit("offer", data);
    });

    socket.on("answer", (data) => {
      socket.to(data.conversationId).emit("answer", data);
    });

    socket.on("ice-candidate", (data) => {
      socket.to(data.conversationId).emit("ice-candidate", data);
    });

    socket.on("leaveRoom", (userId, conversationId) => {
      socket.leave(conversationId);
      socket.to(conversationId).emit("userLeft", { userId });

      console.log(`🚪 User ${userId} left room ${conversationId}`);
    });

    socket.on("endCall", () => {
      socket.broadcast.emit("callEnded");
    });

    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected:", socket.id);
    });
  });

  return io;
};

module.exports = socketSetup;
