const { ObjectId } = require("mongodb");
const dotenv = require("dotenv");
const collectionModel = require("../model/collectionModel");
/// get collection of user
exports.fetchCollections = async (req, res) => {
  const state = req.params.userid;
  try {
    collectionModel.find({ ownerId: state }).then((data) => {
      res.status(200).json({ success: true, collection: data });
    });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};
/// create collection
exports.createCollection = async (req, res) => {
  const userID = req.params.userid;
  console.log(userID);
  const { name } = req.body.collection;
  const newCollection = new collectionModel({
    name: name,
    ownerId: userID,
    recipeID: [],
  });
  try {
    newCollection.save().then((data) => {
      res.status(200).json({ success: true, collection: data });
    });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, error: "cant create new collection" });
  }
};
/// user add to collection
exports.addCollection = async (req, res) => {
  const userID = req.params.userid;
  const { collectionID, recipeID, ownerID } = req.body.propCollection;
  // if doesn't have collectionID
  if (!collectionID) {
    try {
      collectionModel
        .findOneAndUpdate(
          {
            ownerId: userID,
            recipeID: recipeID,
          },
          { $pull: { recipeID: recipeID } }
        )
        .then(() => {
          res.status(200).json({ success: true, removed: recipeID });
        });
    } catch (error) {
      res.status(400).json({ success: false });
    }
  } else {
    try {
      const data = await collectionModel.findOne({
        _id: collectionID,
        ownerId: userID,
        recipeID: recipeID,
      });
      // res.status(200).json({ data });
      if (data) {
        collectionModel
          .findOneAndUpdate(
            {
              _id: collectionID,
              ownerId: userID,
            },
            { $pull: { recipeID: recipeID } }
          )
          .then(() => {
            res.status(200).json({ success: true, removed: recipeID });
          });
      } else {
        collectionModel
          .findOneAndUpdate(
            {
              _id: collectionID,
              ownerId: userID,
            },
            { $push: { recipeID: recipeID } }
          )
          .then(() => {
            res.status(200).json({ success: true, added: recipeID });
          });
      }
    } catch (error) {
      res.status(400).json({ success: false });
    }
  }
  /// if has collectionID
};
exports.checkisdaddedtoCollection = async (req, res) => {
  const userID = req.params.userid;
  const recipeId = req.query.recipeID;
  // console.log(recipeId);
  try {
    const isAdded = await collectionModel.findOne({
      ownerId: userID,
      recipeID: recipeId,
    });
    // console.log(isAdded);
    if (isAdded) {
      res.status(200).json({ success: true, exist: true });
    } else {
      res.status(200).json({ success: true, exist: false });
    }
  } catch (error) {
    res.status(400).json({ success: false });
  }
};
exports.deleteCollection = async (req, res) => {
  try {
    const collectionID = req.params.collectionid;

    if (!collectionID) {
      return res.status(400).json({
        success: false,
        message: "Collection ID is required",
      });
    }

    // Xóa collection
    const deleted = await collectionModel.findByIdAndDelete(collectionID);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Collection not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Collection deleted successfully",
    });
  } catch (error) {
    console.error("Delete collection error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
