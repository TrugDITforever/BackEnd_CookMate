const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  _id: String,
  ownerId: String,
  foodId: String,
});

const postModel = new mongoose.model("posts", postSchema);
module.exports = postModel;