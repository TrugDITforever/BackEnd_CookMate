const { ObjectId } = require("mongodb");
// const foodModel = require("../model/foodModel");
const userLogModel = require("../model/user_logs");

exports.postUserLog = async (req, res) => {
  const { user_id, food_id, interaction = "view" } = req.body;

  try {
    const existingLog = await userLogModel.findOne({
      user_id: new ObjectId(user_id),
      food_id: new ObjectId(food_id),
      interaction: interaction,
    });

    if (existingLog) {
      await userLogModel.deleteOne({ _id: existingLog._id });

      return res.status(200).json({
        success: true,
        toggled: false,
        message: "Existing log removed",
      });
    }

    const newLog = await userLogModel.create({
      user_id: new ObjectId(user_id),
      food_id: new ObjectId(food_id),
      interaction,
      timestamp: new Date(),
    });

    return res.status(200).json({
      success: true,
      toggled: true,
      message: "Log created",
      data: newLog,
    });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to toggle log: " + error.message,
    });
  }
};
