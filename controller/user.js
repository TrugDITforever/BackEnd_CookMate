const { ObjectId } = require("mongodb");
const dotenv = require("dotenv");
const foodModel = require("../model/foodModel");
const userModel = require("../model/userModel");
const collectionModel = require("../model/collectionModel");
const jwt = require("jsonwebtoken");
/// user login to app
exports.userLogin = async (req, res) => {
  const state = req.body;
  const email = state.email;
  const password = state.password;
  const my_secret_key = process.env.jwt_token;
  try {
    const user = await userModel.findOne({ email: email, password: password });
    if (user) {
      const userData = {
        _id: user._id,
        email: user.email,
        role: user.role,
      };
      const token = jwt.sign(userData, my_secret_key, {
        expiresIn: "3h",
      });
      res.status(200).json({ dataUser: user, success: true, token: token });
    } else {
      res
        .status(400)
        .json({ success: false, error: "Invalid email or password" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
///uesr signup to app
exports.userSignup = async (req, res) => {
  const { fullname, email, password } = req.body;
  const my_secret_key = process.env.jwt_token;
  const profileImage =
    "https://th.bing.com/th/id/OIP.hC6OpIcdstV531Pg7XnT7QHaHa?rs=1&pid=ImgDetMain";
  try {
    // add new user to database
    await userModel.collection.insertOne({
      name: fullname,
      username: "",
      email: email,
      password: password,
      description: "Descripe yourself here...",
      payment: [],
      liked: [],
      cart: [],
      friends: [],
      role: 2,
      profileImage: profileImage,
    });
    // Find user just added to database
    const newUser = await userModel.findOne({ email: email });
    if (newUser) {
      const userData = {
        _id: newUser._id,
        email: newUser.email,
        role: newUser.role,
      };
      const token = jwt.sign(userData, my_secret_key, {
        expiresIn: "3h",
      });
      res.status(200).json({ dataUser: newUser, success: true, token: token });
    } else {
      res.status(404).json({ success: false, error: "User not found" });
    }
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ success: false, error: "Email already existed." });
    }
  }
};
// // fetch userposts by id
// exports.fetchuserPostsbyId = (req, res) => {
//   const state = req.params.userId;
//   const ownerId = new ObjectId(`${state}`);
//   foodModel
//     .aggregate([
//       { $match: { ownerId: ownerId } },
//       {
//         $lookup: {
//           from: "users",
//           localField: "ownerId",
//           foreignField: "_id",
//           as: "userpost",
//         },
//       },
//       {
//         $project: {
//           _id: 1,
//           foodName: 1,
//           foodImage: 1,
//           userpost: {
//             _id: 1,
//             username: 1,
//             profileImage: 1,
//           },
//         },
//       },
//       // { $limit: 20 },
//     ])
//     .then((data) => {
//       res.status(200).json({
//         postData: data,
//       });
//     });
// };
// /// fetch userLikedPost by id
// exports.fetchUserLikedPost = (req, res) => {
//   const state = req.params.userId;
//   const userID = new ObjectId(`${state}`);
//   try {
//     userModel
//       .aggregate([
//         { $match: { _id: userID } },
//         {
//           $unwind: "$liked",
//         },
//         {
//           $lookup: {
//             from: "foods",
//             localField: "liked",
//             foreignField: "_id",
//             as: "userpost",
//           },
//         },
//         {
//           $project: {
//             _id: { $arrayElemAt: ["$userpost._id", 0] },
//             foodImage: { $arrayElemAt: ["$userpost.foodImage", 0] },
//           },
//         },
//         // { $limit: 20 },
//       ])
//       .then((data) => {
//         res.status(200).json({
//           postData: data,
//         });
//       });
//   } catch (error) {}
// };
///user update profile
exports.userUpdateProfile = (req, res) => {
  const state = req.body;
  const stateId = req.params.userid;
  const userid = new ObjectId(`${stateId}`);
  const updatedInfo = {
    name: state.name,
    username: state.username,
    email: state.email,
    profileImage: state.profilePicture,
    description: state.description,
  };
  try {
    userModel
      .findByIdAndUpdate({ _id: userid }, updatedInfo, { new: true })
      .then((user) => {
        res.status(200).json({ dataUser: user, success: true });
      });
  } catch (error) {
    res.status(400).json({ error: "Can't update profile" });
  }
};
///user delete account
exports.userDeleteAccount = (req, res) => {
  const userid = new ObjectId(`${req.params.userid}`);
  try {
    userModel.findByIdAndDelete(req.params.userid).then((user) => {
      res.status(200).json({ deletedUser: user, success: true });
    });
  } catch {
    res.status(400).json({ error: "Can't delete account" });
  }
};
//user serching recipe
exports.searchingRecipe = async (req, res) => {
  const recipeName = req.query.recipeName;
  try {
    foodModel
      .find({ foodName: { $regex: recipeName, $options: "i" } })
      .then((data) => {
        res.status(200).json({ success: true, results: data });
      });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};
//get user by id
exports.getUserById = (req, res) => {
  const userid = new ObjectId(`${req.params.userid}`);
  try {
    userModel.findById({ _id: userid }).then((user) => {
      res.status(200).json({ dataUser: user, success: true });
    });
  } catch (err) {
    throw new Error(err);
  }
};
exports.addfriend = async (req, res) => {
  const { userId, friendId } = req.body;
  try {
    const isAdded = await userModel.findOne({ _id: userId, friends: friendId });
    if (isAdded) {
      userModel
        .findByIdAndUpdate(userId, {
          $pull: { friends: new ObjectId(`${friendId}`) },
        })
        .then(() => {
          res.status(200).json({ success: true, removed: friendId });
        });
    } else {
      userModel
        .findByIdAndUpdate(userId, {
          $push: { friends: new ObjectId(`${friendId}`) },
        })
        .then(() => {
          res.status(200).json({ success: true, added: friendId });
        });
    }
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

exports.getUserInfoById = (req, res) => {
  const userId = req.params.id;
  try {
    userModel.findOne({ _id: userId }).then((user) => {
      res.status(200).json({
        success: true,
        UserData: user,
      });
    });
  } catch (error) {
    res.status(400).json({
      succes: false,
    });
  }
};

exports.getUserFriends = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await userModel.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      friends: user.friends,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
exports.getFriendList = (req, res) => {
  const state = req.params.id;
  const userId = new ObjectId(`${state}`);
  console.log(userId);
  try {
    userModel
      .aggregate([
        { $match: { _id: userId } },
        {
          $unwind: "$friends",
        },
        {
          $lookup: {
            from: "users",
            localField: "friends",
            foreignField: "_id",
            as: "friendsDetails",
          },
        },
        {
          $project: {
            _id: { $arrayElemAt: ["$friendsDetails._id", 0] },
            name: { $arrayElemAt: ["$friendsDetails.name", 0] },
            profileImage: {
              $arrayElemAt: ["$friendsDetails.profileImage", 0],
            },

            // "friendsDetails.name": 1, // Lấy thông tin cụ thể của bạn bè
            // "friendsDetails.email": 1,
            // "friendsDetails.profileImage": 1,
          },
        },
        // { $limit: 20 },
      ])
      .then((data) => {
        res.status(200).json({
          success: true,
          friendsdList: data,
        });
      });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message, // Gửi thông báo lỗi chi tiết nếu có
    });
  }
};
