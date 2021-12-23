const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const authenticateToken = require("../app");

// Get list of users and passwords
// Not for production!!!
router.get("/", authenticateToken, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Register a new user
router.post("/register", async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10); // "10" parameter produces salt with default value 10
  const user = new User({
    username: req.body.username,
    password: hashedPassword,
  });
  try {
    const newUser = await user.save();
    res.status(201).send("User registered!");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Authenticate a user, and provide them with access and refresh tokens
router.post("/login", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (user === null) {
    return res.status(400).send("User not found");
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      const username = req.body.username;
      const accessToken = generateAccessToken(username);
      const refreshToken = generateRefreshToken;
      res.json({ accessToken: accessToken, refreshToken: refreshToken });
    } else {
      res.send("Password incorrect");
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const generateAccessToken = (username) => {
  return jwt.sign(username, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "10m",
  });
};

const generateRefreshToken = (username) => {
  return jwt.sign(username, process.env.REFRESH_TOKEN_SECRET);
};

module.exports = router;
