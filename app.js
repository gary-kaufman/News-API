const express = require("express")
const mongoose = require("mongoose")
require("dotenv").config()
const cors = require("cors")
const app = express()
const jwt = require("jsonwebtoken")
require("dotenv").config()

// Database Connection
try {
    mongoose.connect("mongodb://localhost/news", { useNewUrlParser: true })
    console.log("Connected to DB!")
} catch (err) {
    console.log(err)
}
db = mongoose.connection

// Express Server
app.use(cors())
app.listen(3001, () => {
    console.log("Listening on port 3001!")
})
app.use(express.json())

// Routers
const postsRouter = require("./routes/posts")
app.use("/posts", postsRouter)
