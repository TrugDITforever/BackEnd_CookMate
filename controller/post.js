const foodModel = require("../model/foodModel");
const userModel = require("../model/userModel");
const { ObjectId } = require("mongodb");
/// fetch userposts by id
exports.fetchuserPostsbyId = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.userId);

    // pagination query
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 20;

    const data = await foodModel.aggregate([
      { $match: { ownerId: userId } },
      { $sort: { createdAt: -1 } },

      // ⭐ pagination
      { $skip: skip },
      { $limit: limit },

      // Join user
      {
        $lookup: {
          from: "users",
          localField: "ownerId",
          foreignField: "_id",
          as: "userpost",
        },
      },

      // clean result
      {
        $project: {
          _id: 1,
          foodName: 1,
          foodImage: 1,
          createdAt: 1,
          userpost: {
            _id: 1,
            username: 1,
            profileImage: 1,
          },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      postData: data,
      nextSkip: skip + limit,
      hasMore: data.length === limit, // = còn dữ liệu để load
    });
  } catch (error) {
    console.error("Fetch user post failed:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
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

// test api
exports.randomizeRatings = async (req, res) => {
  try {
    const result = await foodModel.updateMany({}, [
      {
        $set: {
          avgRating: {
            $round: [{ $add: [3.5, { $multiply: [{ $rand: {} }, 1.5] }] }, 1],
          },
          hearts: {
            $floor: {
              $add: [500, { $multiply: [{ $rand: {} }, 5000] }],
            },
          },
          ratingCount: {
            $floor: {
              $multiply: [{ $rand: {} }, 200],
            },
          },
          createdAt: {
            $dateSubtract: {
              startDate: new Date(),
              unit: "day",
              amount: {
                $floor: {
                  $multiply: [{ $rand: {} }, 180], // 0 → 180 ngày
                },
              },
            },
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      modified: result.modifiedCount,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
