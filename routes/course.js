const express = require("express");
const { userMiddleware } = require("../middleware/user");
const { purchaseModel, courseModel } = require("../db");
const router = express.Router();

router.post("/purchase", userMiddleware, async function (req, res) {
  const userId = req.userId;
  const courseId = req.body.courseId;

  //should check if user has actually paid the price
  await purchaseModel.create({
    userId,
    courseId,
  });

  res.json({
    message: "You have successfully purchased",
  });
});

router.get("/preview", async function (req, res) {
  const courses = await courseModel.find({});
  res.json({
    courses,
  });
});

module.exports = {
  courseRouter: router,
};
