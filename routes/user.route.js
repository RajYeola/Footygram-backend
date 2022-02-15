const express = require("express");
const router = express.Router();
const {
  getUser,
  getAllUsers,
  editUsername,
  createNewUser,
  signinUser,
  followUser,
  unfollowUser,
  getUserByUsername,
} = require("../controllers/user.controller");
const { verifyAuth } = require("../middleware/verifyAuth");

router.post("/signup", createNewUser);
router.post("/signin", signinUser);

router.get("/", verifyAuth, getUser);
router.get("/allUsers", getAllUsers);

router.post("/:userID", verifyAuth, editUsername);

router.post("/follow/:username", verifyAuth, followUser);
router.post("/unfollow/:username", verifyAuth, unfollowUser);

router.get("/:username", getUserByUsername);

module.exports = router;
