const express = require("express")
const router = express.Router()
const User = require("../models/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const authenticateToken = require("../app")

// Get list of users and passwords
// Not for production!!!
router.get("/", authenticateToken, async (req, res) => {
    try {
        res.status(200).json({ message: "You are logged in!" })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Register a new user
router.post("/register", async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10) // "10" parameter produces salt with default value 10
    const user = new User({
        username: req.body.username,
        password: hashedPassword,
    })
    try {
        const newUser = await user.save()
        res.status(201).send("User registered!")
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Should be modified to a Redis cache or held in database later
let refreshTokens = []

// Check for refresh token, if valid, provide new access token
router.post("/token", (req, res) => {
    const refreshToken = req.body.token
    if (refreshToken == null) return res.sendStatus(401)
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, username) => {
            if (err) return res.sendStatus(403)
            const accessToken = generateAccessToken(username)
            res.json({ accessToken: accessToken })
        }
    )
})

// Authenticate a user, and provide them with access and refresh tokens
router.post("/login", async (req, res) => {
    const user = await User.findOne({ username: req.body.username })
    if (user === null) {
        return res.status(400).send("User not found")
    }
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            const username = req.body.username
            const accessToken = generateAccessToken(username)
            const refreshToken = generateRefreshToken(username)
            refreshTokens.push(refreshToken)
            res.json({ accessToken: accessToken, refreshToken: refreshToken })
        } else {
            res.send("Password incorrect")
        }
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Delete Refresh token will logout a user
router.delete("/logout", (req, res) => {
    refreshTokens = refreshTokens.filter((token) => token !== req.body.token)
    res.sendStatus(204).json({ message: "You have successfully logged out." })
})

const generateAccessToken = (username) => {
    return jwt.sign({ username: username }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "20s",
    })
}

const generateRefreshToken = (username) => {
    return jwt.sign(username, process.env.REFRESH_TOKEN_SECRET)
}

module.exports = router
