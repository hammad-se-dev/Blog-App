'use client';

import AddBlogForm from '../components/AddBlogForm';
import Link from 'next/link';

export default function DashboardClient({ posts }) {
  return (
    <main className="container mx-auto p-4">
      <AddBlogForm />
      <h2 className="text-3xl font-bold mb-6">Blog Posts</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <div key={post.id} className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
            <p className="text-gray-600 mb-4">{post.excerpt}</p>
            <Link
                href={`/posts/${post.id}`}
                className="text-blue-600 hover:underline"
              >
                Read More
              </Link>
            </div>
        ))}
      </div>
    </main>
  );
}
