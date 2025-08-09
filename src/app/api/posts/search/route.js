// src/app/api/posts/search/route.js

import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Post from '@/models/post';

// GET - Search posts
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit')) || 20;
    const skip = parseInt(searchParams.get('skip')) || 0;

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ message: 'Search query is required' }, { status: 400 });
    }

    // Build the search filter
    const searchFilter = {
      $text: { $search: query }
    };

    // Add user filter if specified
    if (userId) {
      searchFilter.user_id = userId;
    }

    // Perform text search with score sorting
    const posts = await Post.find(
      searchFilter,
      { score: { $meta: 'textScore' } } // Include search score
    )
    .sort({ score: { $meta: 'textScore' }, createdAt: -1 }) // Sort by relevance then date
    .limit(limit)
    .skip(skip)
    .lean(); // Use lean() for better performance

    // Get total count for pagination
    const totalCount = await Post.countDocuments(searchFilter);

    return NextResponse.json({
      posts,
      totalCount,
      hasMore: skip + posts.length < totalCount,
      query: query.trim()
    }, { status: 200 });

  } catch (error) {
    console.error('GET /api/posts/search error:', error);
    return NextResponse.json({ 
      message: 'Search failed', 
      error: error.message 
    }, { status: 500 });
  }
}
