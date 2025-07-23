'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function AddBlogForm({ onPostAdded }) {
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    const { data, error } = await supabase
      .from('posts')
      .insert([{ title, excerpt, content }])
      .select()
      .single();
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSuccess('Blog post added!');
      setTitle('');
      setExcerpt('');
      setContent('');
      if (onPostAdded) onPostAdded(data);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-8 bg-white/90 rounded-3xl shadow-2xl border border-indigo-100">
      <h2 className="text-2xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 tracking-tight drop-shadow">
        Add New Blog Post
      </h2>
      <div className="mb-6">
        <label className="block mb-2 font-semibold text-indigo-700">Title</label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full border-2 border-indigo-100 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 px-4 py-3 rounded-xl text-lg transition duration-200 bg-indigo-50 placeholder:text-indigo-300"
          required
          placeholder="Enter a catchy title..."
        />
      </div>
      <div className="mb-6">
        <label className="block mb-2 font-semibold text-indigo-700">Excerpt</label>
        <input
          type="text"
          value={excerpt}
          onChange={e => setExcerpt(e.target.value)}
          className="w-full border-2 border-indigo-100 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 px-4 py-3 rounded-xl text-lg transition duration-200 bg-indigo-50 placeholder:text-indigo-300"
          required
          placeholder="A short summary of your post..."
        />
      </div>
      <div className="mb-8">
        <label className="block mb-2 font-semibold text-indigo-700">Content</label>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          className="w-full border-2 border-indigo-100 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 px-4 py-3 rounded-xl text-lg transition duration-200 bg-indigo-50 placeholder:text-indigo-300 min-h-[120px]"
          rows={5}
          required
          placeholder="Write your blog content here..."
        />
      </div>
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white font-bold py-3 rounded-xl shadow-lg hover:from-indigo-700 hover:to-pink-600 transition-all duration-200 text-lg disabled:opacity-60 disabled:cursor-not-allowed"
        disabled={loading}
      >
        {loading ? 'Adding...' : 'Add Post'}
      </button>
      {error && <p className="text-red-600 mt-4 text-center font-semibold">{error}</p>}
      {success && <p className="text-green-600 mt-4 text-center font-semibold">{success}</p>}
    </form>
  );
}