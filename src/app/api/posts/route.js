// src/app/api/posts/route.js

import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Post from '@/models/post'; // <-- Import the new Post model

// GET - Fetch all posts with optional user filtering
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    const filter = {};
    if (userId) {
      filter.user_id = userId;
    }

    const allPosts = await Post.find(filter).sort({ createdAt: -1 });
    return NextResponse.json(allPosts, { status: 200 });

  } catch (error) {
    console.error('GET /api/posts error:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

// POST - Create new post
export async function POST(req) {
  try {
    await connectDB();
    const { title, excerpt, content, user_id } = await req.json();

    if (!title || !content || !user_id) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const createdPost = await Post.create({ title, excerpt, content, user_id });
    return NextResponse.json(createdPost, { status: 201 });

  } catch (error) {
    console.error('POST /api/posts error:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}