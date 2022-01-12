const mongoose = require("mongoose")

const postSchema = new mongoose.Schema(
    {
        postTitle: {
            type: String,
            required: true,
        },
        postBody: {
            type: String,
            required: true,
        },
        author: {
            type: String,
            required: true,
        },
        postDate: {
            type: Date,
            required: true,
            default: Date.now,
        },
    },
    { collection: "posts" }
)

module.exports = mongoose.model("Post", postSchema)
