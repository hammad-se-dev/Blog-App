"use client";

import { useState, useEffect } from "react";
import AddBlogForm from "../components/AddBlogForm";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function DashboardClient() {
  const [showForm, setShowForm] = useState(false);
  const [showMyBlogs, setShowMyBlogs] = useState(false);
  const [userId, setUserId] = useState(null);
  const [postToEdit, setPostToEdit] = useState(null);
  const queryClient = useQueryClient();

  // Get user ID from localStorage
  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      console.log('Dashboard - Retrieved user:', user); // Debug log
      if (user?.id) {
        setUserId(user.id);
      }
    } catch (err) {
      console.error('Error parsing user from localStorage:', err);
    }
  }, []);

  const {
    data: postList = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["posts", showMyBlogs, userId],
    queryFn: async () => {
      const url = showMyBlogs && userId 
        ? `/api/posts?userId=${userId}` 
        : '/api/posts';
      
      console.log('Fetching posts from:', url); // Debug log
      
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch posts");
      const data = await res.json();
      
      console.log('Fetched posts:', data); // Debug log
      return data;
    },
    enabled: showMyBlogs ? !!userId : true,
  });

  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: async (postId) => {
      console.log('Deleting post:', postId); // Debug log
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error("Failed to delete post");
      return postId;
    },
    
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts", showMyBlogs, userId],
      });
    },
  });

  const handleDelete = (postId) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      deletePost(postId);
    }
  };

  const handleEdit = (post) => {
    setPostToEdit(post);
    setShowForm(true);
  };

  const handlePostAddedOrUpdated = () => {
    refetch();
    setShowForm(false);
    setPostToEdit(null);
  };

  return (
    <main className="container mx-auto p-4 min-h-screen">
      <div className="flex flex-wrap gap-4 justify-between items-center mb-8">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 drop-shadow-lg tracking-tight">
          Blog Posts
        </h2>
        <div className="flex gap-4 items-center">
          <button
            className={`px-6 py-2 rounded-full shadow-lg border-2 font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2
              ${
                showMyBlogs
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white border-pink-300"
                  : "bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50"
              } ${!userId ? "opacity-60 cursor-not-allowed" : ""}`}
            onClick={() => {
              if (!userId) {
                alert("⚠️ Please log in to view your blogs!");
                return;
              }
              setShowMyBlogs((prev) => !prev);
            }}
            title={userId ? "" : "Log in to use this filter"}
          >
            {showMyBlogs ? "Show All Blogs" : "Show My Blogs"}
          </button>
          <button
            className={`flex items-center gap-2 px-6 py-2 rounded-full shadow-lg border-2 border-indigo-200 font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2
              ${
                showForm
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600"
                  : "bg-white text-indigo-700 hover:bg-indigo-50"
              }`}
            onClick={() => {
              setPostToEdit(null);
              setShowForm(!showForm);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            {showForm ? "Cancel" : "Add Blog"}
          </button>
        </div>
      </div>

    

      {showForm && (
        <div className="mb-10 animate-fade-in">
          <div className="rounded-2xl shadow-xl border border-purple-100 bg-white/80 p-6">
            <AddBlogForm
              onPostAdded={handlePostAddedOrUpdated}
              postToEdit={postToEdit}
            />
          </div>
        </div>
      )}

      {/* Blog List */}
      {isLoading ? (
        <div className="text-center text-gray-400 py-24">Loading posts...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-24">
          Error loading posts: {error.message}
        </div>
      ) : postList.length === 0 ? (
        <div className="text-center text-gray-400 py-24">
          {showMyBlogs ? "You haven't created any blog posts yet." : "No blog posts yet."}
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 items-stretch">
          {postList.map((post) => (
            <div key={post._id} className="relative group h-full">
              <div className="h-full flex flex-col justify-between bg-white/90 p-6 rounded-3xl shadow-xl border border-indigo-100 group relative overflow-hidden transition-all duration-200 hover:scale-[1.025] hover:shadow-2xl hover:border-pink-200">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-2xl font-bold text-indigo-700 group-hover:text-pink-600 transition-colors duration-200 pr-4">
                    <Link href={`/posts/${post._id}`}>{post.title}</Link>
                  </h3>
                  {showMyBlogs && userId && post.user_id === userId && (
                    <div className="flex gap-2 flex-shrink-0">
                      {/* Edit Button */}
                      <button
                        onClick={() => handleEdit(post)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-2 shadow-lg transition-colors duration-200"
                        title="Edit Blog"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(post._id)}
                        disabled={isDeleting}
                        className="bg-pink-600 hover:bg-pink-700 text-white rounded-full p-2 shadow-lg transition-colors duration-200 disabled:opacity-50"
                        title="Delete Blog"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>

                <Link href={`/posts/${post._id}`}>
                  <p className="text-gray-600 mb-5 line-clamp-3 min-h-[60px] text-base leading-relaxed">
                    {post.excerpt ||
                      post.content?.slice(0, 100) +
                        (post.content?.length > 100 ? "..." : "")}
                  </p>
                </Link>

                {/* Post metadata */}
                <div className="text-xs text-gray-500 mt-auto pt-4 border-t border-gray-100">
                  Created: {new Date(post.createdAt).toLocaleDateString()}
                  {post.updatedAt !== post.createdAt && (
                    <span className="ml-2">
                      (Updated: {new Date(post.updatedAt).toLocaleDateString()})
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}