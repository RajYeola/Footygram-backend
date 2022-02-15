const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const postSchema = new Schema(
  {
    _id: Schema.Types.ObjectId,
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    reactions: {
      laugh: [{ type: Schema.Types.ObjectId, ref: "User" }],
      like: [{ type: Schema.Types.ObjectId, ref: "User" }],
      wow: [{ type: Schema.Types.ObjectId, ref: "User" }],
      love: [{ type: Schema.Types.ObjectId, ref: "User" }],
      celebrate: [{ type: Schema.Types.ObjectId, ref: "User" }],
    },
  },
  {
    timestamps: true,
  }
);

const Post = model("Post", postSchema);

module.exports = Post;

// reactions: {
//   type: Map,
//   of: [
//     {
//       type: Schema.Types.ObjectId,
//       ref: "User",
//     },
//   ],
// },
