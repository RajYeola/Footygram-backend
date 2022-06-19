const Post = require("../models/post.model");
const User = require("../models/user.model");
const mongoose = require("mongoose");

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate("user", "_id name username")
      .populate("reactions.like")
      .populate("reactions.laugh")
      .populate("reactions.love")
      .populate("reactions.celebrate")
      .populate("reactions.wow")
      .sort("-createdAt");

    return res.json({ success: true, posts });
  } catch (error) {
    return res.json({ success: false, errorMessage: error.message });
  }
};

const createNewPost = async (req, res) => {
  try {
    const { postContent, imageURL } = req.body;
    const { userID } = req.user;

    const newPost = new Post({
      _id: new mongoose.Types.ObjectId(),
      user: userID,
      content: postContent,
      imageURL: imageURL,
      reactions: {
        laugh: [],
        like: [],
        wow: [],
        love: [],
        celebrate: [],
      },
    });

    await newPost.save();

    const newPostData = await Post.findById(newPost._id).populate(
      "user",
      "_id name username"
    );

    return res.json({ success: true, newPost: newPostData });
  } catch (error) {
    return res.json({
      success: false,
      errorMessage: error.message,
    });
  }
};

const addReactionToPost = async (req, res) => {
  try {
    const { postID, reaction } = req.params;
    const { userID } = req.user;

    const user = await User.findById(userID);
    const post = await Post.findById(postID)
      .populate("user", "_id name username")
      .populate("reactions.like")
      .populate("reactions.laugh")
      .populate("reactions.love")
      .populate("reactions.celebrate")
      .populate("reactions.wow");
    const reactionToUpdateArray = post.reactions[`${reaction}`];
    const hasUserReacted = reactionToUpdateArray.some(
      (user) => user._id.toString() === userID
    );

    if (!hasUserReacted) {
      post.reactions[`${reaction}`].push(user);
      await post.save();
      return res.json({ success: true, post });
    } else {
      return res.json({ success: true, post });
    }
  } catch (error) {
    return res.json({ success: false, errorMessage: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const { postID } = req.params;

    const post = await Post.findById(postID);
    await post.remove();

    return res.json({ success: true, post });
  } catch (error) {
    res.json({ success: false, errorMessage: error.message });
  }
};

const deleteReactionFromPost = async (req, res) => {
  try {
    const { postID, reaction } = req.params;
    const { userID } = req.user;

    const user = await User.findById(userID);
    const post = await Post.findById(postID)
      .populate("user", "_id name username")
      .populate("reactions.like")
      .populate("reactions.laugh")
      .populate("reactions.love")
      .populate("reactions.celebrate")
      .populate("reactions.wow");
    const reactionToUpdateArray = post.reactions[`${reaction}`];
    const hasUserReacted = reactionToUpdateArray.some(
      (user) => user._id.toString() === userID
    );

    if (hasUserReacted) {
      post.reactions[`${reaction}`].pull(user);
      await post.save();
      return res.json({ success: true, post });
    } else {
      return res.json({ success: true, post });
    }
  } catch (error) {
    return res.json({ success: false, errorMessage: error.message });
  }
};

module.exports = {
  getAllPosts,
  createNewPost,
  addReactionToPost,
  deletePost,
  deleteReactionFromPost,
};
