const express = require("express")
const mongoose = require("mongoose")
require("dotenv").config()
const cors = require("cors")
const app = express()
require("dotenv").config()
const PORT = 3002

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
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}!`)
})
app.use(express.json())

// Routers
const postsRouter = require("./routes/posts")
app.use("/posts", postsRouter)
