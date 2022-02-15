const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    _id: Schema.Types.ObjectId,
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    following: [{ type: Schema.Types.ObjectId, ref: "User" }],
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
