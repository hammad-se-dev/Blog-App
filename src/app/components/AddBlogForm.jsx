'use client';

import { useState } from 'react';
import useBlogStore from '../store/blogStore'; // 👈 import your Zustand store
import { ToastContainer, toast } from 'react-toastify';


export default function AddBlogForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [success, setSuccess] = useState(null);
  const addPost = useBlogStore((state) => state.addPost);
  const generateExcerpt = (text, maxLength = 150) => {
    if (!text) return '';
    const stripped = text.replace(/<[^>]*>/g, '');
    return stripped.length > maxLength
      ? stripped.substring(0, maxLength).trim() + '...'
      : stripped;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const excerpt = generateExcerpt(content);
    const newPost = {
      id: Date.now(), // mock ID
      title,
      content,
      excerpt,
      created_at: new Date().toISOString(),
    };
    
    addPost(newPost);
    setTitle('');
    setContent('');
    setSuccess('Blog post added!');
    toast(success)
  };
  

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-8 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Add Blog Post</h2>
      
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border p-2 rounded mb-4"
        required
      />

      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full border p-2 rounded mb-4"
        rows={5}
        required
      />

      <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Add Post
      </button>

      {/* {success && <p className="text-green-600 mt-2">{success}</p>} */}
      <ToastContainer />

    </form>
  );
}
