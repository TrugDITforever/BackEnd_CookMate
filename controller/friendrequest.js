const { ObjectId } = require("mongodb");
const FriendRequest = require("../model/friendrequest");
const Friend = require("../model/friends");
const userModel = require("../model/userModel");

// Tạo yêu cầu kết bạn mới
exports.createFriendRequest = (req, res) => {
  const { senderId, receiverId } = req.body;

  const newRequest = new FriendRequest({
    senderId: senderId,
    receiverId: receiverId,
    status: "pending",
    requestedAt: new Date(),
  });

  try {
    newRequest.save().then((savedRequest) => {
      res.status(200).json({ request: savedRequest, success: true });
    });
  } catch (error) {
    res.status(400).json({ error: "Can't create friend request" });
  }
};

// Lấy tất cả yêu cầu kết bạn
exports.getAllFriendRequests = (req, res) => {
  const userId = req.params.id;
  console.log(userId)

  try {
    FriendRequest.find({ receiverId: userId, status: "pending" }).then(
      (requests) => {
        res.status(200).json({ requests: requests, success: true });
      }
    );
  } catch (error) {
    res.status(400).json({ error: "Can't fetch friend requests" });
  }
};

exports.checkCreateFriendRequest = (req, res) => {
  const {receiverId} = req.params
  const senderId  = req.query.senderId; 
  try {
    FriendRequest.find({ senderId: senderId, receiverId: receiverId, status: "pending" }).then(
      (requests) => {
        if (requests.length === 0){
          res.status(200).json({ requests: requests, success: false });
        }
        else {
          res.status(200).json({ requests: requests, success: true });
        }
      }
    );
  } catch (error) {
    res.status(400).json({ error: "Can't fetch friend requests" });
  }
}

// Chấp nhận yêu cầu kết bạn
// exports.acceptFriendRequest = (req, res) => {
//   const { requestId } = req.params;
//   const acceptData = req.body;

//   try {
//     FriendRequest.findByIdAndUpdate(
//       requestId,
//       { status: "accepted", respondedAt: new Date() },
//       { new: true }
//     ).then((updatedRequest) => {
//       if (updatedRequest) {
//         res.status(200).json({ request: updatedRequest, success: true });
//       } else {
//         res.status(404).json({ error: "Friend request not found" });
//       }
//     });
//   } catch (error) {
//     res.status(400).json({ error: "Can't accept friend request" });
//   }
// };
exports.acceptFriendRequest = (req, res) => {
  const {requestId} = req.params;
  const acceptData = req.body;
  // console.log(acceptData)
  // console.log(requestId); 

  try {
    FriendRequest.findByIdAndUpdate(
      requestId,
      { status: "accepted", respondedAt: new Date() },
      { new: true }
    ).then((updatedRequest) => {
      if (updatedRequest) {
        const { userId, friendId } = acceptData;

        userModel
          .findByIdAndUpdate(userId, {
            $push: { friends: new ObjectId(`${friendId}`) },
          })
          .then(() => {
                // Đồng thời, thêm userId vào danh sách bạn bè của friendId
            userModel
              .findByIdAndUpdate(friendId, {
                $push: { friends: new ObjectId(`${userId}`) },
              })
              .then(() => {
                res.status(200).json({ success: true, added: friendId });
              });
          });
        } else {
          res.status(404).json({ error: "Friend request not found", success: false, });
        }
    });
  } catch (error) {
    res.status(400).json({ error: "Can't accept friend request", success: false, });
  }
};

// Từ chối yêu cầu kết bạn
exports.rejectFriendRequest = (req, res) => {
  const { requestId } = req.params;

  try {
    FriendRequest.findByIdAndUpdate(
      requestId,
      { status: "rejected", respondedAt: new Date() },
      { new: true }
    ).then((updatedRequest) => {
      if (updatedRequest) {
        res.status(200).json({ request: updatedRequest, success: true });
      } else {
        res.status(404).json({ error: "Friend request not found" });
      }
    });
  } catch (error) {
    res.status(400).json({ error: "Can't reject friend request" });
  }
};

// Xóa yêu cầu kết bạn
exports.deleteFriendRequest = (req, res) => {
  const { requestId } = req.params;

  try {
    FriendRequest.findByIdAndDelete(requestId).then((deletedRequest) => {
      if (deletedRequest) {
        res
          .status(200)
          .json({ message: "Friend request deleted", success: true });
      } else {
        res.status(404).json({ error: "Friend request not found" });
      }
    });
  } catch (error) {
    res.status(400).json({ error: "Can't delete friend request" });
  }
};
exports.getFriendRequestById = (req, res) => {
  const requestId = req.params.id;
  try {
    FriendRequest.findById(requestId).then((friendRequest) => {
      if (friendRequest) {
        res.status(200).json({ friendRequest, success: true });
      } else {
        res.status(404).json({ error: "Friend request not found" });
      }
    });
  } catch (error) {
    res.status(400).json({ error: "Can't fetch friend request" });
  }
};
exports.updateFriendRequest = (req, res) => {
  const requestId = req.params.id;
  const updatedData = req.body; // Thường bao gồm trạng thái accept/reject

  try { 
    FriendRequest
      .findByIdAndUpdate(requestId, updatedData, { new: true })
      .then((updatedRequest) => {
        if (updatedRequest) {
          res
            .status(200)
            .json({ friendRequest: updatedRequest, success: true });
        } else {
          res.status(404).json({ error: "Friend request not found" });
        }
      }); 
  } catch (error) {
    res.status(400).json({ error: "Can't update friend request" });
  }
};
