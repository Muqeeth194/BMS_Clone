const router = require("express").Router();
const dbUsers = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware.js");

router.post("/register", async (req, res) => {
  try {
    const user = req.body;
    const userExists = await dbUsers.findOne({ email: user.email });

    if (userExists) {
      return res.send({
        success: false,
        message: "User with this email already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);

    const newUser = dbUsers({ ...user, password: hashedPassword });
    newUser.save();

    res.send({
      success: true,
      message: "User is successfully registered",
    });
  } catch (error) {
    res.send({
      success: false,
      message: "Internal Server Error",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await dbUsers.findOne({ email: req.body.email });

    if (!user) {
      return res.send({
        success: false,
        message: "User does not exist",
      });
    }

    const isValidUser = await bcrypt.compare(req.body.password, user.password);
    if (!isValidUser) {
      return res.send({
        success: false,
        message: "Incorrect password",
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.jwt_secret, {
      expiresIn: "1d",
    });

    res.send({
      success: true,
      message: "User is logged in",
      data: token,
    });
  } catch (error) {
    res.send({
      success: false,
      message: "Internal Serevr Error",
    });
  }
});

// Protected route/endpoint
router.get("/currentUser", authMiddleware, async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await dbUsers.findOne({ _id: userId});

    if (!user) {
      return res.send({
        success: false,
        message: "User not found",
      });
    }

    return res.send({
      success: true,
      message: "User is fetched successfully",
      data: user,
    });
  } catch (error) {
    res.send({
      success: false,
      message: "Something went wrong",
      error: error,
    });
  }
});

exports.router = router;
