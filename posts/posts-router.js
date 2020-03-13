const express = require("express");
const db = require("../data/db.js");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const posts = await db.find();
    res.status(200).json({ success: true, posts });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

router.post("/", async (req, res) => {
  const newPost = req.body;
  if (newPost.title && newPost.contents) {
    try {
      const addedPost = await db.insert(newPost);
      res.status(201).json({ success: true, addedPost });
    } catch (error) {
      res.status(500).json({ success: false, error });
    }
  } else {
    res.status(400).json({
      success: false,
      message: "please provide title and contents for the post"
    });
  }
});

module.exports = router;
