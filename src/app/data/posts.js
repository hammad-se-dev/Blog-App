// /src/app/data/posts.js

export async function getPosts() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/posts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Ensure fresh data on each request
    });

    if (!response.ok) {
      console.error('Failed to fetch posts:', response.status);
      return [];
    }

    const posts = await response.json();
    return posts || [];
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export async function getPostById(id) {
  try {
    if (!id || id === 'undefined') {
      console.error('Invalid post ID:', id);
      return null;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/posts/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Ensure fresh data on each request
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.log('Post not found:', id);
        return null;
      }
      console.error('Failed to fetch post:', response.status);
      return null;
    }

    const post = await response.json();
    return post || null;
  } catch (error) {
    console.error('Error fetching post by ID:', error);
    return null;
  }
}