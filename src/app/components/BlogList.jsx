'use client';

import useBlogStore from '../store/blogStore';

export default function BlogList() {
  const posts = useBlogStore((state) => state.posts);

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">All Blog Posts</h2>
      {posts.length === 0 ? (
        <p className="text-gray-500">No blog posts available.</p>
      ) : (
        <ul className="space-y-4">
          {posts.map((post) => (
            <li key={post.id} className="p-4 border rounded shadow">
              <h3 className="text-xl font-semibold">{post.title}</h3>
              <p className="text-gray-600 text-sm mb-2">
                {new Date(post.created_at).toLocaleString()}
              </p>
              <p>{post.excerpt}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
