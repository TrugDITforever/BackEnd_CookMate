const { ObjectId } = require("mongodb");
const foodModel = require("../model/foodModel");
const userModel = require("../model/userModel");
// / show food deatails when user click on
exports.getFoodById = (req, res) => {
  const state = req.params.foodId;
  const foodId = new ObjectId(`${state}`);
  try {
    /// query find food by _id
    foodModel.findById({ _id: foodId }).then((food) => {
      res.status(200).json({ foodData: food, success: true });
    });
  } catch (err) {
    throw new Error(err);
  }
};
/// insert into database then  create new recipe
exports.userpostRecipe = (req, res) => {
  const state = req.body;
  const newRecipe = new foodModel({
    foodName: state.foodName,
    foodImage: state.foodImage,
    description: state.description,
    ingredients: state.ingredients,
    instructions: state.instructions,
    ownerId: new ObjectId(`${state.ownerId}`),
  });
  try {
    newRecipe.save().then((newfood) => {
      res.status(200).json({ newRecipe: newfood, success: true });
    });
  } catch (error) {
    res.status(400).json({ error: "Can't create recipe" });
  }
};
/// user update their recipe
exports.userUpDatepostRecipe = (req, res) => {
  const state = req.body;
  const foodid = req.params.foodid;
  const updateRecipe = {
    foodName: state.foodName,
    foodImage: state.foodImage,
    description: state.description,
    ingredients: state.ingredients,
    instructions: state.instructions,
  };
  try {
    foodModel
      .findByIdAndUpdate({ _id: foodid }, updateRecipe, { new: true })
      .then((newfood) => {
        res.status(200).json({ newRecipe: newfood, success: true });
      });
  } catch (error) {
    res.status(400).json({ error: "Can't update recipe" });
  }
};
/// user delete their recipe
exports.userDeleteRecipe = (req, res) => {
  const id = req.params.foodid;
  try {
    foodModel.findByIdAndDelete(id).then((food) => {
      res.status(200).json({ deletedRecipe: food, success: true });
    });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};
/// user add a new recipe to their likes
exports.userLikesRecipe = async (req, res) => {
  const userId = req.params.userid;
  const foodId = req.body.recipeId;
  try {
    const isliked = await userModel.findOne({
      _id: userId,
      liked: foodId,
    });
    if (isliked) {
      userModel
        .findByIdAndUpdate(userId, {
          $pull: { liked: new ObjectId(`${foodId}`) },
        })
        .then((food) => {
          res.status(200).json({ success: false, removed: foodId });
        });
    } else {
      userModel
        .findByIdAndUpdate(userId, {
          $push: { liked: new ObjectId(`${foodId}`) },
        })
        .then((food) => {
          res.status(200).json({ success: true, added: foodId });
        });
    }
  } catch (error) {
    res.status(400).json({ success: false });
  }
};
///check if user liked recipe
exports.checkisLiked = async (req, res) => {
  const userId = req.params.userid;
  const foodId = req.query.recipeId;
  try {
    const data = await userModel.findOne({ _id: userId, liked: foodId });
    if (data) {
      res.status(200).json({ success: true, exist: true });
    } else {
      res.status(200).json({ success: true, exist: false });
    }
  } catch (error) {
    res.status(400).json({ success: false });
  }
};
//webApi
//create new recipe
exports.createRecipe = async (req, res) => {
  const state = req.body;
  const newRecipe = new foodModel({
    foodName: state.foodName,
    foodImage: state.foodImage,
    calories: state.calories,
    level: state.level,
    serves: state.serves,
    mealType: state.mealType,
    description: state.description,
    ingredients: state.ingredients,
    instructions: state.instructions,
    ownerId: new ObjectId(`${state.ownerId}`),
  });
  try {
    newRecipe.save().then((newfood) => {
      res.status(200).json({ newRecipe: newfood, success: true });
    });
  } catch (error) {
    res.status(400).json({ error: "Can't create recipe" });
  }
};
//Update new recipe
exports.updateRec = async (req, res) => {
  const state = req.body;
  const foodid = req.params.foodId;
  const updateRecipe = {
    foodName: state.foodName,
    foodImage: state.foodImage,
    calories: state.calories,
    level: state.level,
    serves: state.serves,
    mealType: state.mealType,
    description: state.description,
    ingredients: state.ingredients,
    instructions: state.instructions,
  };
  try {
    foodModel
      .findByIdAndUpdate({ _id: foodid }, updateRecipe, { new: true })
      .then((newfood) => {
        res.status(200).json({ newRecipe: newfood, success: true });
      });
  } catch (error) {
    res.status(400).json({ error: "Can't update recipe" });
  }
};
