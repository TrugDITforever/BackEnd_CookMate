const express = require("express");
const admin = require("../controller/admin");
const recipe = require("../controller/recipe");
const router = express.Router();
router.use(express.json());
router.get("/api/getFoodByID/:foodId", recipe.getFoodById);
/// get all food
router.get("/api/getAllfood/:mealType", admin.fetchDataFood);
/// user create a new recipe
router.post("/api/createRecipe", recipe.userpostRecipe);
/// user update their recipe
router.put("/api/updateRecipe/:foodid", recipe.userUpDatepostRecipe);
/// user delete their recipe
router.delete("/api/deleteRecipe/:foodid", recipe.userDeleteRecipe);
/// user like recipe -> add to like attribute
router.put("/api/likeRecipe/:userid", recipe.userLikesRecipe);
/// check is like recipe
router.get("/api/checklikeRecipe/:userid", recipe.checkisLiked);
//web api 
//create a new recipe
router.post("/api/addRecipe", recipe.createRecipe)
//update recipe
router.patch("/api/updateRec/:foodId", recipe.updateRec)
module.exports = router;
