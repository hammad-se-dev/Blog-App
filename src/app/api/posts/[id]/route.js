// src/app/api/posts/[id]/route.js

import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Post from '@/models/post';

// GET - Get single post
export async function GET(req, context) {
  try {
    const { params } = context; // ✅ context is synchronous
    await connectDB();
    const post = await Post.findById(params.id);

    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    console.error('GET /api/posts/[id] error:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

// PUT - Update existing post
export async function PUT(req, context) {
  try {
    const { params } = context;
    await connectDB();
    const { title, excerpt, content } = await req.json();

    const updatedPost = await Post.findByIdAndUpdate(
      params.id,
      { title, excerpt, content },
      { new: true }
    );

    if (!updatedPost) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json(updatedPost, { status: 200 });
  } catch (error) {
    console.error('PUT /api/posts/[id] error:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

// DELETE - Delete a post
export async function DELETE(req, context) {
  try {
    const { params } = context;
    await connectDB();
    const deletedPost = await Post.findByIdAndDelete(params.id);

    if (!deletedPost) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Post deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('DELETE /api/posts/[id] error:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}
