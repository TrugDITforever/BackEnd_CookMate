const mongoose = require("mongoose");
const collectionSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  name: String,
  ownerId: mongoose.Schema.Types.ObjectId,
  recipeID: [mongoose.Schema.Types.ObjectId],
});

const collectionModel = new mongoose.model("collections", collectionSchema);
module.exports = collectionModel;
