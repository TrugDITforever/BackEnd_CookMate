const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    id: ObjectId,
    name: String,
    price: Number,
    rating: Number,
    ownerID: ObjectId,
  },
  {
    versionKey: false, // Disable versioning
  }
);

const courseModel = new mongoose.model("courses", courseSchema);
module.exports = courseModel;
