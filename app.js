const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

// Database Connection
try {
  mongoose.connect("mongodb://localhost/news", { useNewUrlParser: true });
  console.log("Connected to DB!");
} catch (err) {
  console.log(err);
}
db = mongoose.connection;

// Express Server
const app = express();
app.listen(3000, () => {
  console.log("Listening on port 3000!");
});
app.use(express.json());

// Routers
const postsRouter = require("./routes/posts");
app.use("/posts", postsRouter);
