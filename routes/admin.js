const express = require("express");
const router = express.Router();
const { adminModel } = require("../db");
const jwt = require("jsonwebtoken");
//bcrypt, zod,jsonwebtoken
const { JWT_ADMIN_PASSWORD } = require("../config");
const { adminMiddleware } = require("../middleware/admin");

router.post("/signup", async function (req, res) {
  const { email, password, firstName, lastName } = req.body; //Add validation
  //hash password
  //put inside try catch block
  await adminModel.create({
    email: email,
    password: password,
    firstName: firstName,
    lastName: lastName,
  });

  res.json({
    message: "Sign up succeeded",
  });
});

router.post("/signin", async function (req, res) {
  const { email, password } = req.body;
  //compare hashed password instead direct

  const admin = await adminModel.findOne({
    email: email,
    password: password,
  });

  if (admin) {
    const token = jwt.sign(
      {
        id: admin._id,
      },
      JWT_ADMIN_PASSWORD
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

router.post("/course", adminMiddleware, async function (req, res) {
  const adminId = req.userId;

  const { title, description, imageUrl, price } = req.body;

  // creating a web3 saas in 6 hours
  const course = await courseModel.create({
    title: title,
    description: description,
    imageUrl: imageUrl,
    price: price,
    creatorId: adminId,
  });

  res.json({
    message: "Course created",
    courseId: course._id,
  });
});

router.put("/course", adminMiddleware, async function (req, res) {
  const adminId = req.userId;

  const { title, description, imageUrl, price, courseId } = req.body;

  // creating a web3 saas in 6 hours
  const course = await courseModel.updateOne(
    {
      _id: courseId,
      creatorId: adminId,
    },
    {
      title: title,
      description: description,
      imageUrl: imageUrl,
      price: price,
    }
  );

  res.json({
    message: "Course updated",
    courseId: course._id,
  });
});

router.get("/course/bulk", adminMiddleware, async function (req, res) {
  const adminId = req.userId;

  const courses = await courseModel.find({
    creatorId: adminId,
  });

  res.json({
    message: "Course updated",
    courses,
  });
});

module.exports = {
  adminRouter: router,
};
