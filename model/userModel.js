const mongoose = require("mongoose");

const Userschema = new mongoose.Schema({
  name: String,
  username: String,
  email: String,
  password: String,
  profileImage: String,
  description: String,
  role: Number,
  liked: [mongoose.Schema.Types.ObjectId],
  cart: [mongoose.Schema.Types.ObjectId],
  payment: [Object],
  friends: [mongoose.Schema.Types.ObjectId],
});
const userModel = new mongoose.model("users", Userschema);
module.exports = userModel;
