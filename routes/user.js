const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_USER_PASSWORD } = require("../config");
const { userMiddleware } = require("../middleware/user");
const { userModel, purchaseModel } = require("../db");

router.post("/signup", userMiddleware, async function (req, res) {
  const { email, password, firstName, lastName } = req.body;
  await userModel.create({
    email: email,
    password: password,
    firstName: firstName,
    lastName: lastName,
  });

  res.json({
    message: "Signup succeeded",
  });
});

router.post("/signin", userMiddleware, async function (req, res) {
  const { email, password } = req.body;
  const user = await userModel.findOne({
    email: email,
    password: password,
  });

  if (user) {
    const token = jwt.sign(
      {
        id: user._id,
      },
      JWT_USER_PASSWORD
    );

    res.json({
      token: token,
    });
  } else {
    res.status(403).json({
      message: "Invalid credentials",
    });
  }
});

router.get("/purchases", userMiddleware, async function (req, res) {
  const userId = req.userId;

  const purchases = await purchaseModel.find({
    userId,
  });

  let purchasedCourseIds = [];

  for (let i = 0; i < purchases.length; i++) {
    purchasedCourseIds.push(purchases[i].courseId);
  }

  const coursesData = await courseModel.find({
    _id: { $in: purchasedCourseIds },
  });

  res.json({
    purchases,
    coursesData,
  });
});

module.exports = {
  userRouter: router,
};
