// /src/app/api/posts/[id]/route.js
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET - Get single post
export async function GET(req, { params }) {
  try {
    const { id } = params;

    if (!id || id === 'undefined') {
      return NextResponse.json({ 
        message: 'Post ID is required' 
      }, { status: 400 });
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ 
        message: 'Invalid post ID format' 
      }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const posts = db.collection('posts');

    const post = await posts.findOne({ _id: new ObjectId(id) });

    if (!post) {
      return NextResponse.json({ 
        message: 'Post not found' 
      }, { status: 404 });
    }

    return NextResponse.json(post, { status: 200 });

  } catch (error) {
    console.error('GET /api/posts/[id] error:', error);
    return NextResponse.json({ 
      message: 'Server error', 
      error: error.message 
    }, { status: 500 });
  }
}

// PUT - Update existing post
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const { title, excerpt, content } = await req.json();

    if (!title || !content) {
      return NextResponse.json({ 
        message: 'Title and content are required' 
      }, { status: 400 });
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ 
        message: 'Invalid post ID format' 
      }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const posts = db.collection('posts');

    const result = await posts.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          title: title.trim(), 
          excerpt: excerpt ? excerpt.trim() : '', 
          content: content.trim(), 
          updatedAt: new Date() 
        } 
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ 
        message: 'Post not found' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Post updated successfully',
      modifiedCount: result.modifiedCount 
    }, { status: 200 });

  } catch (error) {
    console.error('PUT /api/posts/[id] error:', error);
    return NextResponse.json({ 
      message: 'Server error', 
      error: error.message 
    }, { status: 500 });
  }
}

// DELETE - Delete a post
export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ 
        message: 'Invalid post ID format' 
      }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const posts = db.collection('posts');

    const result = await posts.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ 
        message: 'Post not found' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Post deleted successfully' 
    }, { status: 200 });

  } catch (error) {
    console.error('DELETE /api/posts/[id] error:', error);
    return NextResponse.json({ 
      message: 'Server error', 
      error: error.message 
    }, { status: 500 });
  }
}