const express = require("express");
const post = require("../controller/post");
const admin = require("../controller/admin");
const router = express.Router();
router.use(express.json());
/// fetch user posts base on user ID
router.get("/api/fetchUserPostById/:userId", post.fetchuserPostsbyId);
/// fetch user liked posts based on ID
router.get("/api/fetchUserLikedPostById/:userId", post.fetchUserLikedPost);
/// get all post belong to user
router.get("/api/fetchUserposts", admin.fetchuserPosts);
router.post("/seed/random-ratings", post.randomizeRatings);

module.exports = router;
