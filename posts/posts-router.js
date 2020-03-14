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

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const post = await db.findById(id);
    post
      ? res.status(201).json({ success: true, post })
      : res
          .status(404)
          .json({ success: false, message: "no post found by that id" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await db.remove(id);
    deleted
      ? res.status(204).end()
      : res
          .status(404)
          .json({ success: false, message: "no post found by that id" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, contents } = req.body;
  if (title && contents) {
    try {
      const updated = await db.update(id, { title, contents });
      console.log(`updated`);
      updated
        ? res.status(200).json({ success: true, updated })
        : res
            .status(404)
            .json({ success: false, message: "no post found by that id" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, error });
    }
  } else {
    res.status(400).json({
      success: false,
      message: "please provide title and contents for the post"
    });
  }
});

router.get("/:id/comments", async (req, res) => {
  const { id } = req.params;
  try {
    const comments = await db.findPostComments(id);
    comments
      ? res.status(200).json({ success: true, comments })
      : res
          .status(404)
          .json({ success: false, message: "no post found by that id" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

router.post("/:id/comments", async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const comment = { text, post_id: id };
  if (comment) {
    try {
      const post = await db.findById(id);
      if (post) {
        try {
          const addedComment = await db.insertComment(comment);
          res.status(200).json({ success: true, comment: addedComment });
        } catch (error) {
          res.status(500).json({
            success: false,
            error,
            message: "failed at inserting comment"
          });
        }
      } else {
        res
          .status(400)
          .json({ success: false, message: "can not find post by that id" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ success: false, error, message: "failed at finding id" });
      console.log(error);
    }
  } else {
    res
      .status(400)
      .json({ success: false, message: "please provide text for comment" });
  }
});

module.exports = router;
