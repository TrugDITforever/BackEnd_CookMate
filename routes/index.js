const express = require("express");
const user = require("../controller/user");
const admin = require("../controller/admin");
const router = express.Router();
router.use(express.json());
/// get all user account
/**
 * @swagger
 * /api/admin/getUserAccount:
 *   get:
 *     summary: Get all user accounts
 *     tags:
 *      - Admin
 *     responses:
 *       200:
 *         description: Successfully fetched all user accounts
 */
router.get("/api/admin/getUserAccount", admin.fetchDataUser);

/// user login
/**
 * @swagger
 * /api/checkuser:
 *   post:
 *     summary: User login
 *     tags:
 *      - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               username: "exampleuser"
 *               password: "examplepassword"
 *     responses:
 *       200:
 *         description: Successfully logged in
 */
router.post("/api/checkuser", user.userLogin);
/// user sign up
/**
 * @swagger
 * /api/userRegister:
 *   post:
 *     summary: create user account
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               username: "exampleuser"
 *               password: "examplepassword"
 *     responses:
 *       200:
 *         description: Successfully create user accounts
 */
router.post("/api/userRegister", user.userSignup);
/// user update information
/**
 * @swagger
 * /api/updateinfo/:userid:
 *   put:
 *     summary: update user
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Successfully update user accounts
 */
router.put("/api/updateinfo/:userid", user.userUpdateProfile);
/// user delete their own account
/**
 * @swagger
 * /api/deleteAccount/:userid:
 *   delete:
 *     summary: delete user
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Successfully delete user accounts
 */
router.delete("/api/deleteAccount/:userid", user.userDeleteAccount);
/// get all user accounts
router.get("/api/getAlluser", admin.fetchDataUser);
/// searching results
router.get("/api/searchRecipe", user.searchingRecipe);
/// get user by id
router.get("/api/getUserById/:userid", user.getUserById);

/// addfriend
router.post("/api/user/addfriend", user.addfriend);
// get user info by id
router.get("/api/user/:id", user.getUserInfoById);
router.get("/api/user/friendslist/:id", user.getUserFriends);
router.get("/api/user/friends/:id", user.getFriendList);

module.exports = router;
