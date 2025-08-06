// /src/app/data/posts.js

// Determine the base URL once.
// In production (on Render), process.env.NEXT_PUBLIC_BASE_URL MUST be set.
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

// On the server, if the URL is still pointing to localhost in a production environment, something is wrong.
if (process.env.NODE_ENV === 'production' && BASE_URL.includes('localhost')) {
  console.error("FATAL: NEXT_PUBLIC_BASE_URL is not set for production!");
  // This helps you catch the configuration error early.
}


export async function getPosts() {
  try {
    const response = await fetch(`${BASE_URL}/api/posts`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error(`Failed to fetch posts: ${response.status} ${response.statusText}`);
      return [];
    }
    return response.json();
  } catch (error) {
    console.error('Error in getPosts:', error);
    return [];
  }
}


export async function getPostById(id) {
  // Check for invalid id early
  if (!id) {
    console.error('getPostById called with invalid ID.');
    return null;
  }

  try {
    const fetchUrl = `${BASE_URL}/api/posts/${id}`;
    console.log(`Fetching post from: ${fetchUrl}`); // Debug log to see the URL

    const response = await fetch(fetchUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error(`Failed to fetch post ${id}: ${response.status} ${response.statusText}`);
      return null;
    }

    return response.json();
  } catch (error) {
    console.error(`Error in getPostById for id ${id}:`, error);
    return null;
  }
}