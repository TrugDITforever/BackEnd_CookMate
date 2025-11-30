const foodModel = require("../model/foodModel");
const userModel = require("../model/userModel");
const { ObjectId } = require("mongodb");
/// fetch userposts by id
exports.fetchuserPostsbyId = (req, res) => {
  const state = req.params.userId;
  const ownerId = new ObjectId(`${state}`);
  foodModel
    .aggregate([
      { $match: { ownerId: ownerId } },
      { $sort: { liked: -1 } },

      {
        $lookup: {
          from: "users",
          localField: "ownerId",
          foreignField: "_id",
          as: "userpost",
        },
      },
      {
        $project: {
          _id: 1,
          foodName: 1,
          foodImage: 1,
          userpost: {
            _id: 1,
            username: 1,
            profileImage: 1,
          },
        },
      },
      { $limit: 20 },
    ])
    .then((data) => {
      res.status(200).json({
        postData: data,
      });
    });
};
/// fetch userLikedPost by id
exports.fetchUserLikedPost = (req, res) => {
  const state = req.params.userId;
  const userID = new ObjectId(`${state}`);
  try {
    userModel
      .aggregate([
        { $match: { _id: userID } },
        {
          $unwind: "$liked",
        },
        { $sort: { liked: -1 } },
        {
          $lookup: {
            from: "foods",
            localField: "liked",
            foreignField: "_id",
            as: "userpost",
          },
        },
        {
          $project: {
            _id: { $arrayElemAt: ["$userpost._id", 0] },
            foodImage: { $arrayElemAt: ["$userpost.foodImage", 0] },
          },
        },
        // { $limit: 20 },
      ])
      .then((data) => {
        res.status(200).json({
          postData: data,
        });
      });
  } catch (error) {}
};
