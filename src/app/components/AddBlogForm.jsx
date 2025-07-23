'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function AddBlogForm({ onPostAdded }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Function to generate excerpt from content
  const generateExcerpt = (text, maxLength = 150) => {
    if (!text) return '';
    const stripped = text.replace(/<[^>]*>/g, ''); // Remove HTML tags if any
    return stripped.length > maxLength 
      ? stripped.substring(0, maxLength).trim() + '...'
      : stripped;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    // Auto-generate excerpt from content
    const excerpt = generateExcerpt(content);
    
    const { data, error } = await supabase
      .from('posts')
      .insert([{ 
        title, 
        excerpt, 
        content,
        created_at: new Date().toISOString()
      }])
      .select();
      
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSuccess('Blog post added!');
      setTitle('');
      setContent('');
      if (onPostAdded) onPostAdded(data?.[0]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white rounded shadow mb-8">
      <h2 className="text-xl font-bold mb-4">Add New Blog Post</h2>
      
      <div className="mb-4">
        <label className="block mb-1 font-medium">Title</label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>
      
      <div className="mb-4">
        <label className="block mb-1 font-medium">Content</label>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          rows={5}
          required
        />
        {content && (
          <p className="text-sm text-gray-600 mt-1">
            Auto excerpt: {generateExcerpt(content, 50)}...
          </p>
        )}
      </div>
      
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? 'Adding...' : 'Add Post'}
      </button>
      
      {error && <p className="text-red-600 mt-2">{error}</p>}
      {success && <p className="text-green-600 mt-2">{success}</p>}
    </form>
  );
}