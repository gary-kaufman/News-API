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

// Get all
router.get("/", async (req, res) => {
    try {
        const posts = await Post.find().sort({ postDate: "desc" })
        res.status(200).json(posts)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Get one by id
router.get("/id=:id", getPostById, (req, res) => {
    res.json(res.post)
})

// Get many by author
router.get("/author=:author", getPostsByAuthor, (req, res) => {
    res.json(res.posts)
})

// Get many by content
router.get("/content=:content", getPostsByContent, (req, res) => {
    res.json(res.posts)
})

// Create one
router.post("/", async (req, res) => {
    const post = new Post({
        postTitle: req.body.postTitle,
        postBody: req.body.postBody,
        author: req.body.author,
    })
    try {
        const newPost = await post.save()
        res.status(201).json({ message: "Post created" })
    } catch (err) {
        res.status(400).json({ message: err.messages })
    }
})

// Update one
router.put("/:id", getPostById, async (req, res) => {
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

// Delete one
router.delete("/:id", getPostById, async (req, res) => {
    try {
        await res.post.remove()
        res.json({ message: "Post deleted" })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

async function getPostById(req, res, next) {
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

async function getPostsByAuthor(req, res, next) {
    let posts
    let author = req.params.author.replace("+", " ")

    try {
        posts = await Post.find({ author: author }).exec()
        if (posts == null) {
            return res.status(404).json({ message: "Cannot find posts." })
        }
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
    res.posts = posts
    next()
}

async function getPostsByContent(req, res, next) {
    let posts
    let content = req.params.content.replace("+", " ")

    try {
        posts = await Post.find({
            postBody: { $regex: content, $options: "i" },
        }).exec()
        if (posts == null) {
            return res.status(404).json({ message: "Cannot find posts." })
        }
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
    res.posts = posts
    next()
}

module.exports = router
