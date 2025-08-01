'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function AddBlogForm({ onPostAdded, postToEdit }) {
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const queryClient = useQueryClient();

  // Fetch user ID once
  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      console.log('Retrieved user from localStorage:', user); // Debug log
      if (user?.id) {
        setUserId(user.id);
      } else {
        setError('User not found. Please log in again.');
      }
    } catch (err) {
      console.error('Error parsing user from localStorage:', err);
      setError('Authentication error. Please log in again.');
    }
  }, []);

  // Pre-fill form if editing
  useEffect(() => {
    if (postToEdit) {
      setTitle(postToEdit.title || '');
      setExcerpt(postToEdit.excerpt || '');
      setContent(postToEdit.content || '');
    }
  }, [postToEdit]);

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ title, excerpt, content }) => {
      console.log('Mutation started with:', { title, excerpt, content, userId }); // Debug log
      
      if (!userId) {
        throw new Error('User not authenticated. Please log in again.');
      }

      const payload = { 
        title: title.trim(), 
        excerpt: excerpt.trim(), 
        content: content.trim(), 
        user_id: userId 
      };

      console.log('Sending payload:', payload); // Debug log

      const url = postToEdit ? `/api/posts/${postToEdit._id}` : '/api/posts';
      const method = postToEdit ? 'PUT' : 'POST';

      console.log(`Making ${method} request to ${url}`); // Debug log

      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('Response status:', res.status); // Debug log

      if (!res.ok) {
        const errorData = await res.json();
        console.error('API Error:', errorData); // Debug log
        throw new Error(errorData.message || `Failed to ${postToEdit ? 'update' : 'create'} post`);
      }

      const responseData = await res.json();
      console.log('Response data:', responseData); // Debug log
      return responseData;
    },

    onSuccess: (data) => {
      console.log('Mutation successful:', data); // Debug log
      setSuccess(postToEdit ? 'Post updated successfully!' : 'Post added successfully!');
      
      // Only clear form if not editing
      if (!postToEdit) {
        setTitle('');
        setExcerpt('');
        setContent('');
      }
      
      setError(null);
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      
      if (onPostAdded) {
        onPostAdded(data);
      }
    },
    
    onError: (error) => {
      console.error('Mutation error:', error); // Debug log
      setError(error.message);
      setSuccess(null);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Client-side validation
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (!content.trim()) {
      setError('Content is required');
      return;
    }
    if (!userId) {
      setError('User not authenticated. Please log in again.');
      return;
    }

    console.log('Form submitted with:', { title, excerpt, content }); // Debug log
    mutate({ title, excerpt, content });
  };

  return (
    <div className="max-w-lg mx-auto p-8 bg-white/90 rounded-3xl shadow-2xl border border-indigo-100">
      <form onSubmit={handleSubmit}>
        <h2 className="text-2xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 tracking-tight drop-shadow">
          {postToEdit ? 'Edit Blog Post' : 'Add New Blog Post'}
        </h2>

        {/* Debug info - remove in production
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-4 p-2 bg-gray-100 rounded text-xs">
            <strong>Debug:</strong> User ID: {userId || 'Not set'}
          </div>
        )} */}

        <div className="mb-6">
          <label className="block mb-2 font-semibold text-indigo-700">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full border-2 border-indigo-100 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 px-4 py-3 rounded-xl text-lg transition duration-200 bg-indigo-50 placeholder:text-indigo-300"
            required
            placeholder="Enter a catchy title..."
            maxLength={200}
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-semibold text-indigo-700">
            Excerpt
          </label>
          <input
            type="text"
            value={excerpt}
            onChange={e => setExcerpt(e.target.value)}
            className="w-full border-2 border-indigo-100 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 px-4 py-3 rounded-xl text-lg transition duration-200 bg-indigo-50 placeholder:text-indigo-300"
            placeholder="A short summary of your post..."
            maxLength={300}
          />
        </div>

        <div className="mb-8">
          <label className="block mb-2 font-semibold text-indigo-700">
            Content <span className="text-red-500">*</span>
          </label>
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
          className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white font-bold py-3 rounded-xl shadow-lg hover:from-indigo-700 hover:to-pink-600 transition-all duration-200 text-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          disabled={isPending || !userId}
        >
          {isPending && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          )}
          {isPending 
            ? (postToEdit ? 'Updating...' : 'Adding...') 
            : (postToEdit ? 'Update Post' : 'Add Post')
          }
        </button>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-center font-semibold">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-600 text-center font-semibold">{success}</p>
          </div>
        )}
        
        {!postToEdit && success && userId && (
          <p className="text-indigo-700 mt-2 text-center text-sm">
            Your user ID: <span className="font-mono break-all">{userId}</span>
          </p>
        )}

        {!userId && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-700 text-center text-sm">
              ⚠️ Please log in to add or edit posts
            </p>
          </div>
        )}
      </form>
    </div>
  );
}