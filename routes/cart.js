const express = require("express");
const admin = require("../controller/admin");
const cart = require("../controller/cart");
const router = express.Router();
router.use(express.json());
/// user add to cart
/// fetching all courses
router.get("/api/fetchingCourses", admin.fetchCourses);
/// check is add to cart
router.get("/api/checkIsAddToCart/:userid", cart.checkisdaddedtoCart);
///fetch course by ID
router.get("/api/fetchCoursebyID/:courseID", admin.fetchCourseByID);
router.put("/api/addCourse/:userid", cart.userAddCoursetoCart);
router.get("/api/fetchShoppingCart/:userid", cart.fetchUserCart);
router.put("/api/checkoutPayment/:userid", cart.checkoutPayment);
router.get("/api/fetchInvoices/:userid", cart.fetchInvoices);
module.exports = router;
