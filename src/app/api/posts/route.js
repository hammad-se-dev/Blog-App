import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// POST - Create new post
export async function POST(req) {
  try {
    const { title, excerpt, content, user_id } = await req.json();

    if (!title || !content || !user_id) {
      return NextResponse.json({ 
        message: 'Missing required fields: title, content, and user_id are required' 
      }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(); // Uses default database from connection string
    const posts = db.collection('posts');

    const newPost = {
      title: title.trim(),
      excerpt: excerpt ? excerpt.trim() : '',
      content: content.trim(),
      user_id: user_id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await posts.insertOne(newPost);

    // Return the created post with its ID
    const createdPost = {
      _id: result.insertedId,
      ...newPost
    };

    return NextResponse.json(createdPost, { status: 201 });

  } catch (error) {
    console.error('POST /api/posts error:', error);
    return NextResponse.json({ 
      message: 'Server error', 
      error: error.message 
    }, { status: 500 });
  }
}

// GET - Fetch all posts with optional user filtering
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    const client = await clientPromise;
    const db = client.db();
    const posts = db.collection('posts');

    // Build query filter
    const filter = {};
    if (userId) {
      filter.user_id = userId;
    }

    console.log('GET /api/posts - Filter:', filter); // Debug log

    const allPosts = await posts
      .find(filter)
      .sort({ createdAt: -1 }) // Sort by newest first
      .toArray();

    console.log('GET /api/posts - Found posts:', allPosts.length); // Debug log

    return NextResponse.json(allPosts, { status: 200 });

  } catch (error) {
    console.error('GET /api/posts error:', error);
    return NextResponse.json({ 
      message: 'Server error', 
      error: error.message 
    }, { status: 500 });
  }
}