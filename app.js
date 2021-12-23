const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const app = express();
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Authenticate Token!
module.exports = authenticateToken = function (req, res, next) {
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

// Database Connection
try {
  mongoose.connect("mongodb://localhost/news", { useNewUrlParser: true });
  console.log("Connected to DB!");
} catch (err) {
  console.log(err);
}
db = mongoose.connection;

// Express Server
app.use(cors());
app.listen(3000, () => {
  console.log("Listening on port 3000!");
});
app.use(express.json());

// Routers
const postsRouter = require("./routes/posts");
app.use("/posts", postsRouter);

const authRouter = require("./routes/auth");
app.use("/auth", authRouter);
