const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Authenticate Token!
authenticateToken = function (req, res, next) {
  const authHeader = req.headers["authorization"];
  console.log(authHeader);
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    return res.sendStatus(401);
  } else {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, username) => {
      if (err) {
        return res.sendStatus(403);
      } else {
        req.username = username;
        next();
      }
    });
  }
};

router.get("/", authenticateToken(), async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10); // "10" parameter produces salt with default value 10
  const user = new User({
    username: req.body.username,
    password: hashedPassword,
  });
  try {
    const newUser = await user.save();
    res.status(201).send("User created!");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (user === null) {
    return res.status(400).send("User not found");
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      username = req.body.username;
      const accessToken = jwt.sign(username, process.env.ACCESS_TOKEN_SECRET);
      res.json({ accessToken: accessToken });
    } else {
      res.send("Password incorrect");
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = { router };
