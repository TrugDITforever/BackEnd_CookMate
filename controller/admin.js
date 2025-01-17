const userModel = require("../model/userModel");
const foodModel = require("../model/foodModel");
const courseModel = require("../model/courseModel");
const { ObjectId } = require("mongodb");
const collectionModel = require("../model/collectionModel");

/// get all user information
exports.fetchDataUser = (req, res) => {
  try {
    userModel.find().then((user) => {
      res.status(200).json({
        UserData: user,
      });
    });
  } catch (error) {
    res.status(400).json({
      UserData: user,
    });
  }
};
/// get all food information base on mealType
exports.fetchDataFood = (req, res) => {
  const state = req.params;
  foodModel.find({ mealType: state.mealType }).then((food) => {
    res.status(200).json({ foodData: food });
  });
};
/// get all post of user 
exports.fetchuserPosts = (req, res) => {
  const ownerId = new ObjectId("66146d7338795a648ebee702");
  foodModel
    .aggregate([
      // { $match: {} },
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
      // { $limit: 10 },
    ])
    .then((data) => {
      res.status(200).json({
        postData: data,
      });
    });
};
// get all courses
exports.fetchCourses = async (req, res) => {
  try {
    const results = await courseModel.find({});
    if (results) {
      res.status(200).json({
        success: true,
        courses: results,
      });
    } else
      res.status(200).json({
        success: false,
        courses: results,
      });
  } catch (error) {
    console.error(error);
  }
};
// get all courses
exports.fetchCourseByID = async (req, res) => {
  const id = req.params.courseID;
  try {
    const results = await courseModel.find({ _id: id });
    if (results) {
      res.status(200).json({
        success: true,
        courses: results,
      });
    } else
      res.status(200).json({
        success: false,
        courses: results,
      });
  } catch (error) {
    console.error(error);
  }
};
exports.fetchRecipeByCollectionID = async (req, res) => {
  const id = req.params.collectionID;
  try {
    collectionModel
      .aggregate([
        { $match: { _id: new ObjectId(id) } },
        // {
        //   $unwind: "$cart",
        // },
        {
          $lookup: {
            from: "foods",
            localField: "recipeID",
            foreignField: "_id",
            as: "results",
          },
        },
        {
          $project: {
            _id: 0,
            name: 1,
            results: {
              _id: 1,
              foodImage: 1,
              foodName: 1,
            },
          },
        },
      ])
      .then((data) => {
        res.status(200).json({
          recipeData: data,
        });
      });
  } catch (error) {
    res.status(400).json({
      succes: "Can not fetch Cart",
    });
  }
};
