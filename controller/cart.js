const { ObjectId } = require("mongodb");
const userModel = require("../model/userModel");
///Cart Feature
exports.checkisdaddedtoCart = async (req, res) => {
  const userId = req.params.userid;
  const courseID = req.query.courseID;
  try {
    const data = await userModel.findOne({ _id: userId, cart: courseID });
    if (data) {
      res.status(200).json({ success: true, exist: true });
    } else {
      res.status(200).json({ success: true, exist: false });
    }
  } catch (error) {
    res.status(400).json({ success: false });
  }
};
exports.userAddCoursetoCart = async (req, res) => {
  const userId = req.params.userid;
  const courseID = req.body.courseID;
  try {
    const isAdd = await userModel.findOne({
      _id: userId,
      cart: courseID,
    });
    if (isAdd) {
      userModel
        .findByIdAndUpdate(userId, {
          $pull: { cart: new ObjectId(`${courseID}`) },
        })
        .then((food) => {
          res.status(200).json({ success: false, removed: courseID });
        });
    } else {
      userModel
        .findByIdAndUpdate(userId, {
          $push: { cart: new ObjectId(`${courseID}`) },
        })
        .then((food) => {
          res.status(200).json({ success: true, added: courseID });
        });
    }
  } catch (error) {
    res.status(400).json({ success: false });
  }
};
exports.fetchUserCart = async (req, res) => {
  const state = req.params.userid;
  const userID = new ObjectId(state);
  // res.status(200).json({ success: true, userID: userID });
  try {
    userModel
      .aggregate([
        { $match: { _id: userID } },
        // {
        //   $unwind: "$cart",
        // },
        {
          $lookup: {
            from: "courses",
            localField: "cart",
            foreignField: "_id",
            as: "shoppingcarts",
          },
        },
        {
          $project: {
            shoppingcarts: {
              _id: 1,
              name: 1,
              image: 1,
              price: 1,
              rating: 1,
            },
          },
        },
      ])
      .then((data) => {
        res.status(200).json({
          cartData: data,
        });
      });
  } catch (error) {
    res.status(400).json({
      succes: "Can not fetch Cart",
    });
  }
};
exports.checkoutPayment = async (req, res) => {
  const userID = req.params.userid;
  const cartsList = req.body.paymentList;
  const currentDate = new Date();

  // Add current date to each cart item
  const cartsWithDate = cartsList.map((cart) => ({
    ...cart,
    date: currentDate,
  }));

  try {
    // Push new payment entries
    await userModel.updateOne(
      { _id: userID },
      { $push: { payment: { $each: cartsWithDate } } }
    );
    // Clear the cart
    await userModel.updateOne({ _id: userID }, { $set: { cart: [] } });
    res.status(200).json({
      success: true,
      message: "Payment added successfully",
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.fetchInvoices = async (req, res) => {
  const userID = new ObjectId(req.params.userid);
  try {
    const payment = await userModel.findOne(
      { _id: userID },
      { _id: 0, payment: 1 }
    );
    if (payment) {
      res.status(200).json({ success: true, payment });
    } else {
      res.status(200).json({ success: true, payment });
    }
  } catch (error) {
    res.status(400).json({ succes: false });
  }
};
