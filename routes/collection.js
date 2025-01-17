const express = require("express");
const admin = require("../controller/admin");
const router = express.Router();
const collection = require("../controller/collection");
router.use(express.json());
/// fetch user collection
router.get("/api/fetchCollections/:userid", collection.fetchCollections);
/// user create a new collection
router.post("/api/createCollection/:userid", collection.createCollection);
/// user add a recipe to selected collection
router.put("/api/addRecipetoCollection/:userid", collection.addCollection);
/// checkif user added recipe to any collection or not
router.get(
  "/api/checkIsaddedtoCollection/:userid",
  collection.checkisdaddedtoCollection
);
/// fetching recipe in collection
router.get(
  "/api/fetchRecipeByCollectionID/:collectionID",
  admin.fetchRecipeByCollectionID
);
module.exports = router;
