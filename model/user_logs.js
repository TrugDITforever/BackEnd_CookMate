const mongoose = require("mongoose");

const logsSchema = new mongoose.Schema({
  //   _id: String,
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  food_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  interaction: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const userLogModel = new mongoose.model("user_logs", logsSchema);
module.exports = userLogModel;
