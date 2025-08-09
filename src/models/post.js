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
      index: true, // Index for faster user-specific queries
    }
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Add compound index for efficient sorting and filtering
postSchema.index({ createdAt: -1 });
postSchema.index({ user_id: 1, createdAt: -1 });

// Add text search indexes for search functionality
postSchema.index({ 
  title: 'text', 
  content: 'text', 
  excerpt: 'text' 
}, {
  weights: {
    title: 10,     // Title has highest weight
    excerpt: 5,    // Excerpt has medium weight  
    content: 1     // Content has lowest weight
  },
  name: 'blog_text_search'
});

// If the model is already compiled, use it. Otherwise, compile it.
const Post = mongoose.models.Post || mongoose.model("Post", postSchema);

export default Post;