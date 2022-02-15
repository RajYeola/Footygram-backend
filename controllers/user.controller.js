const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../models/user.model");

const getUser = async (req, res) => {
  try {
    const { userID } = req.user;
    const user = await User.findById(userID).select(
      "_id email name username followers following posts"
    );

    res.json({ success: true, user });
  } catch (error) {
    res.json({
      success: false,
      message: "Error fetching user data",
      errorMessage: error.message,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});

    res.json({ success: true, users });
  } catch (error) {
    res.json({
      success: false,
      message: "Error fetching users' data",
      errorMessage: error.message,
    });
  }
};

const createNewUser = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      _id: new mongoose.Types.ObjectId(),
      name,
      username,
      email,
      password: hashedPassword,
    });
    const token = jwt.sign({ id: newUser._id }, process.env.SECRET, {
      expiresIn: "24h",
    });

    await newUser.save();

    res.status(200).json({ success: true, userInfo: newUser, token });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      errorMessage: error.message,
    });
  }
};

const signinUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({
      username,
    });
    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "User doesn't exist" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user credentials" });
    }

    if (existingUser && isPasswordCorrect) {
      const token = jwt.sign({ id: existingUser._id }, process.env.SECRET, {
        expiresIn: "24h",
      });

      res.status(200).json({
        success: true,
        message: "Successfully signed in",
        userInfo: existingUser,
        token,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      errorMessage: error.message,
    });
  }
};

const followUser = async (req, res) => {
  try {
    const { userID } = req.user;
    const { username } = req.params;

    const userToFollow = await User.findOne({ username })
      .populate("followers", "_id name username")
      .populate("following", "_id name username");
    const user = await User.findById(userID)
      .populate("following", "_id name username")
      .populate("followers", "_id name username");

    user.following.push(userToFollow);
    userToFollow.followers.push(user);
    await user.save();
    await userToFollow.save();

    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, errorMessage: error.message });
  }
};

const unfollowUser = async (req, res) => {
  try {
    const { userID } = req.user;
    const { username } = req.params;

    const userToUnfollow = await User.findOne({ username })
      .populate()
      .populate("followers", "_id name username")
      .populate("following", "_id name username");
    const user = await User.findById(userID)
      .populate("following", "_id name username")
      .populate("followers", "_id name username");

    user.following.pull(userToUnfollow);
    userToUnfollow.followers.pull(user);
    await user.save();
    await userToUnfollow.save();

    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, errorMessage: error.message });
  }
};

const editUsername = async (req, res) => {
  try {
  } catch (error) {}
};

const getUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;

    const findUsernameInUsers = await User.findOne({ username })
      .populate("followers", "_id username name")
      .populate("following", "_id username name");

    res.json({ success: true, user: findUsernameInUsers });
  } catch (error) {
    res.json({
      success: false,
      errorMessage: error.message,
    });
  }
};

module.exports = {
  editUsername,
  getUser,
  getAllUsers,
  createNewUser,
  signinUser,
  followUser,
  unfollowUser,
  getUserByUsername,
};
