const Friend = require("../model/friends");

// Tạo bạn bè mới
exports.addFriend = (req, res) => {
  const { userId, friendId } = req.body;

  const newFriend = new Friend({
    userId: userId,
    friends: [friendId],
    addedAt: new Date(),
  }); 

  try {
    newFriend.save().then((savedFriend) => {
      res.status(200).json({ friend: savedFriend, success: true });
    });
  } catch (error) {
    res.status(400).json({ error: "Can't add friend" });
  }
};

// Lấy tất cả danh sách bạn bè của người dùng
exports.getAllFriends = (req, res) => {
  const userId = req.params.id;

  try {
    Friend.findOne({ userId: userId }).then((friendsList) => {
      res.status(200).json({ friends: friendsList, success: true });
    });
  } catch (error) {
    res.status(400).json({ error: "Can't fetch friends list" });
  }
};

// Cập nhật thông tin bạn bè
exports.updateFriend = (req, res) => {
  const { userId, friendId } = req.body;

  try {
    Friend.findOneAndUpdate(
      { userId: userId, "friends.friendId": friendId },
      { $set: { "friends.$.addedAt": new Date() } },
      { new: true }
    ).then((updatedFriend) => {
      if (updatedFriend) {
        res.status(200).json({ friend: updatedFriend, success: true });
      } else {
        res.status(404).json({ error: "Friend not found" });
      }
    });
  } catch (error) {
    res.status(400).json({ error: "Can't update friend" });
  }
};

// Xóa bạn bè
exports.deleteFriend = (req, res) => {
  const { userId, friendId } = req.body;

  try {
    Friend.findOneAndUpdate(
      { userId: userId },
      { $pull: { friends: { friendId: friendId } } }, // Loại bỏ bạn bè khỏi danh sách
      { new: true }
    ).then((updatedFriendList) => {
      if (updatedFriendList) {
        res.status(200).json({ friends: updatedFriendList, success: true });
      } else {
        res.status(404).json({ error: "Friend not found" });
      }
    });
  } catch (error) {
    res.status(400).json({ error: "Can't delete friend" });
  }
};
