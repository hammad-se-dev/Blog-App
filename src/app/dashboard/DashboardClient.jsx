'use client';

import { useState } from 'react';
import AddBlogForm from '../components/AddBlogForm';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';

export default function DashboardClient() {
  const [showForm, setShowForm] = useState(false);
  
  const { data: postList = [], isLoading, error, refetch } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data, error } = await supabase.from('posts').select('*').order('id', { ascending: false });
      if (error) throw new Error(error.message);
      return data || [];
    },
  });

  const handlePostAdded = (newPost) => {
    // Refetch posts after adding
    refetch();
    setShowForm(false);
  };

  return (
    <main className="container mx-auto p-4 min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Add Blog Button */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 drop-shadow-lg tracking-tight">
          Blog Posts
        </h2>
        <button
          className={`flex items-center gap-2 px-6 py-2 rounded-full shadow-lg border-2 border-indigo-200 font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2
            ${showForm ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600' : 'bg-white text-indigo-700 hover:bg-indigo-50'}`}
          onClick={() => setShowForm(!showForm)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          {showForm ? 'Cancel' : 'Add Blog'}
        </button>
      </div>

      {/* Show form conditionally */}
      {showForm && (
        <div className="mb-10 animate-fade-in">
          <div className="rounded-2xl shadow-xl border border-purple-100 bg-white/80 p-6">
            <AddBlogForm onPostAdded={handlePostAdded} />
          </div>
          <div className="flex justify-center my-8">
            <div className="w-1/2 h-1 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 rounded-full" />
          </div>
        </div>
      )}

      {/* Blog List */}
      {isLoading ? (
        <div className="text-center text-gray-400 py-24">Loading posts...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-24">Error loading posts: {error.message}</div>
      ) : postList.length === 0 ? (
        <div className="text-center text-gray-400 py-24">
          <svg className="mx-auto mb-6 w-20 h-20 text-indigo-100" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
            <circle cx="12" cy="12" r="10" />
          </svg>
          <p className="text-xl font-medium">No blog posts yet. Click <span className='text-indigo-600 font-bold'>Add Blog</span> to create your first post!</p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {postList.map((post) => (
            <Link
              key={post.id}
              href={`/posts/${post.id}`}
              className="block bg-white/90 p-6 rounded-3xl shadow-xl border border-indigo-100 group relative overflow-hidden transition-all duration-200 hover:scale-[1.025] hover:shadow-2xl hover:border-pink-200"
            >
              <h3 className="text-2xl font-bold mb-3 text-indigo-700 group-hover:text-pink-600 transition-colors duration-200">
                {post.title}
              </h3>
              <p className="text-gray-600 mb-5 line-clamp-3 min-h-[60px] text-base leading-relaxed">
                {post.excerpt || post.content?.slice(0, 100) + (post.content?.length > 100 ? '...' : '')}
              </p>
              <span className="inline-block mt-2 text-base font-semibold text-pink-600 group-hover:text-indigo-700 group-hover:underline transition-colors duration-200">
                Read More &rarr;
              </span>
              <div className="absolute right-0 top-0 w-20 h-20 bg-gradient-to-br from-indigo-100 to-pink-100 opacity-30 rounded-bl-3xl z-0" />
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
