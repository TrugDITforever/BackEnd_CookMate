const { ObjectId } = require("mongodb");
// const foodModel = require("../model/foodModel");
const userLogModel = require("../model/user_logs");

exports.postUserLog = async (req, res) => {
  const state = req.body;
  console.log(state);
  try {
    const newLog = new userLogModel({
      user_id: new ObjectId(`${state.user_id}`),
      food_id: new ObjectId(`${state.food_id}`),
      interaction: state.interaction ? state.interaction : "view",
      timestamp: new Date(),
    });

    await newLog.save();
    res.status(200).json({ message: "Log saved successfully", success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to save log" + error.message });
  }
};
