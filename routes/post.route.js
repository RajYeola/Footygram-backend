const express = require("express");
const {
  getAllPosts,
  createNewPost,
  addReactionToPost,
  deletePost,
  deleteReactionFromPost,
} = require("../controllers/post.controller");
const { verifyAuth } = require("../middleware/verifyAuth");
const router = express.Router();

router.get("/", getAllPosts);
router.post("/", verifyAuth, createNewPost);

router.delete("/:postID", verifyAuth, deletePost);

router.post("/:postID/:reaction", verifyAuth, addReactionToPost);
router.delete("/:postID/:reaction", verifyAuth, deleteReactionFromPost);

module.exports = router;
