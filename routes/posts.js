const express = require("express")
const router = express.Router()
const Post = require("../models/posts")
require("dotenv").config()

// APIKEY Authentication
router.use(function (req, res, next) {
    if (req.headers.api_key == process.env.API_KEY) {
        return next()
    }
    console.log("API Key Error")
    res.sendStatus(400)
})

// Getting all
router.get("/", async (req, res) => {
    try {
        const posts = await Post.find().sort({ postDate: "desc" })
        res.status(200).json(posts)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Getting one
router.get("/:id", getPost, (req, res) => {
    res.json(res.post)
})

// Creating one
router.post("/", async (req, res) => {
    const post = new Post({
        postTitle: req.body.postTitle,
        postBody: req.body.postBody,
    })
    try {
        const newPost = await post.save()
        res.status(201).json({ message: "Post created" })
    } catch (err) {
        res.status(400).json({ message: err.messages })
    }
})

// Updating one
router.put("/:id", getPost, async (req, res) => {
    if (req.body.postTitle != null) {
        res.post.postTitle = req.body.postTitle
    }
    if (req.body.postBody != null) {
        res.post.postBody = req.body.postBody
    }
    try {
        const updatedPost = await res.post.save()
        res.json({ message: "Post updated" })
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// Deleting one
router.delete("/:id", getPost, async (req, res) => {
    try {
        await res.post.remove()
        res.json({ message: "Post deleted" })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

async function getPost(req, res, next) {
    let post
    try {
        post = await Post.findById(req.params.id)
        if (post == null) {
            return res.status(404).json({ message: "Cannot find post." })
        }
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
    res.post = post
    next()
}

module.exports = router
