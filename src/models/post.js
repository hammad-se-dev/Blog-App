// src/models/post.js

import mongoose, { Schema } from 'mongoose';

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required."],
    },
    excerpt: {
      type: String,
    },
    content: {
      type: String,
      required: [true, "Content is required."],
    },
    // This connects each post to a user.
    user_id: {
      type: String, // Storing the user's string ID from localStorage
      required: true,
    }
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// If the model is already compiled, use it. Otherwise, compile it.
const Post = mongoose.models.Post || mongoose.model("Post", postSchema);

export default Post;