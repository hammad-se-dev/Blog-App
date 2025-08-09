"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import AddBlogForm from "../components/AddBlogForm";
import SearchBar from "../components/SearchBar";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function DashboardClient() {
  const [showForm, setShowForm] = useState(false);
  const [showMyBlogs, setShowMyBlogs] = useState(false);
  const [userId, setUserId] = useState(null);
  const [postToEdit, setPostToEdit] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  // Get user ID from localStorage
  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      console.log("Dashboard - Retrieved user:", user); // Debug log
      if (user?.id) {
        setUserId(user.id);
      }
    } catch (err) {
      console.error("Error parsing user from localStorage:", err);
    }
  }, []);

  // Handle URL search parameters
  useEffect(() => {
    const urlSearchQuery = searchParams.get("search");
    if (urlSearchQuery) {
      setSearchQuery(urlSearchQuery);
      // Trigger search with URL parameter
      fetch(
        `/api/posts/search?q=${encodeURIComponent(urlSearchQuery)}&limit=20`
      )
        .then((res) => res.json())
        .then((data) => {
          setSearchResults(data);
        })
        .catch((err) => {
          console.error("Error fetching search results from URL:", err);
        });
    }
  }, [searchParams]);

  const {
    data: postList = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["posts", showMyBlogs, userId],
    queryFn: async () => {
      const url =
        showMyBlogs && userId ? `/api/posts?userId=${userId}` : "/api/posts";

      console.log("Fetching posts from:", url); // Debug log

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch posts");
      const data = await res.json();

      console.log("Fetched posts:", data); // Debug log
      return data;
    },
    enabled: showMyBlogs ? !!userId : true,
  });

  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: async (postId) => {
      console.log("Deleting post:", postId); // Debug log
      const res = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
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

  // Handle search results update
  const handleSearchResults = useCallback((results, query) => {
    setSearchResults(results);
    setSearchQuery(query);
  }, []);

  // Determine which posts to display
  const displayPosts =
    searchResults && searchQuery ? searchResults.posts : postList;
  const isSearchMode = searchResults && searchQuery;
  const displayTitle = isSearchMode
    ? `Search Results for "${searchQuery}"`
    : "Blog Posts";

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      {!isSearchMode && (
        <div className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 text-white py-20 px-4">
          <div className="container mx-auto text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-200 via-pink-200 to-blue-200">
                Welcome to BlogSpace
              </h1>
              <p className="text-xl md:text-2xl text-purple-200 mb-8 leading-relaxed">
                Discover amazing stories, share your thoughts, and connect with
                fellow writers
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-6 border border-white/20 animate-float shadow-2xl">
                  <div className="text-4xl font-bold text-white mb-2">
                    {postList.length}
                  </div>
                  <div className="text-purple-200 text-lg">Total Posts</div>
                </div>
                {userId && (
                  <div
                    className="bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-6 border border-white/20 animate-float shadow-2xl"
                    style={{ animationDelay: "1s" }}
                  >
                    <div className="text-4xl font-bold text-white mb-2">
                      {
                        postList.filter((post) => post.user_id === userId)
                          .length
                      }
                    </div>
                    <div className="text-purple-200 text-lg">Your Posts</div>
                  </div>
                )}
                <div
                  className="bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-6 border border-white/20 animate-float shadow-2xl"
                  style={{ animationDelay: "2s" }}
                >
                  <div className="text-4xl font-bold text-white mb-2">✨</div>
                  <div className="text-purple-200 text-lg">Keep Writing</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto p-4">
        <div className="flex flex-wrap gap-4 justify-between items-center mb-8 mt-8">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-pink-700 to-indigo-700 drop-shadow-lg tracking-tight">
            {displayTitle}
          </h2>
          <div className="flex gap-4 items-center">
            <button
              className={`px-8 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 shadow-lg
              ${
                showMyBlogs
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-purple-200 animate-pulse-gentle"
                  : "bg-white text-purple-700 border-2 border-purple-200 hover:bg-purple-50 hover:border-purple-300"
              } ${
                !userId ? "opacity-60 cursor-not-allowed" : "hover:shadow-xl"
              }`}
              onClick={() => {
                if (!userId) {
                  alert("⚠️ Please log in to view your blogs!");
                  return;
                }
                setShowMyBlogs((prev) => !prev);
              }}
              title={userId ? "" : "Log in to use this filter"}
            >
              <span className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                {showMyBlogs ? "Show All Blogs" : "Show My Blogs"}
              </span>
            </button>
            <button
              className={`flex items-center gap-3 px-8 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 shadow-lg
              ${
                showForm
                  ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-red-200 hover:from-red-600 hover:to-pink-600"
                  : "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-purple-200 hover:from-purple-700 hover:to-pink-700 animate-gradient"
              } hover:shadow-xl`}
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
                className={`w-5 h-5 transition-transform duration-300 ${
                  showForm ? "rotate-45" : ""
                }`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              {showForm ? "Cancel" : "Add New Blog"}
            </button>
          </div>
        </div>

        {/* Search Results Info */}
        {isSearchMode && (
          <div className="mb-6 p-4 bg-indigo-50 rounded-xl border border-indigo-200">
            <div className="flex justify-between items-center">
              <div className="text-indigo-700">
                <span className="font-semibold">
                  {searchResults.totalCount}
                </span>{" "}
                result{searchResults.totalCount !== 1 ? "s" : ""} found for "
                {searchQuery}"
                {showMyBlogs && (
                  <span className="text-sm ml-2">(from your blogs only)</span>
                )}
              </div>
              <button
                onClick={() => handleSearchResults(null, "")}
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                Clear search
              </button>
            </div>
          </div>
        )}

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
        {isLoading && !isSearchMode ? (
          <div className="text-center text-gray-400 py-24">
            Loading posts...
          </div>
        ) : error && !isSearchMode ? (
          <div className="text-center text-red-500 py-24">
            Error loading posts: {error.message}
          </div>
        ) : displayPosts.length === 0 ? (
          <div className="text-center text-gray-400 py-24">
            {isSearchMode
              ? `No posts found for "${searchQuery}"`
              : showMyBlogs
              ? "You haven't created any blog posts yet."
              : "No blog posts yet."}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-stretch">
            {displayPosts.map((post) => {
              // Calculate reading time (average 200 words per minute)
              const wordCount = post.content?.split(" ").length || 0;
              const readingTime = Math.ceil(wordCount / 200);

              return (
                <article key={post._id} className="relative group h-full">
                  <div className="h-full flex flex-col bg-white rounded-2xl shadow-lg border border-gray-100 group relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:border-purple-200">
                    {/* Card Header with Gradient */}
                    <div className="h-32 bg-gradient-to-br from-purple-400 via-pink-400 to-indigo-400 relative overflow-hidden">
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="absolute top-4 right-4">
                        {/* Reading Time Badge */}
                        <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full border border-white/30">
                          {readingTime} min read
                        </span>
                      </div>
                      <div className="absolute bottom-4 left-4 right-16">
                        <h3 className="text-xl font-bold text-white line-clamp-2 leading-tight">
                          <Link
                            href={`/posts/${post._id}`}
                            className="hover:text-purple-200 transition-colors"
                          >
                            {post.title}
                          </Link>
                        </h3>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="flex-1 p-6">
                      {/* Action Buttons */}
                      {showMyBlogs && userId && post.user_id === userId && (
                        <div className="flex gap-2 justify-end mb-4">
                          <button
                            onClick={() => handleEdit(post)}
                            className="bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg p-2 transition-colors duration-200 shadow-sm"
                            title="Edit Blog"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(post._id)}
                            disabled={isDeleting}
                            className="bg-red-100 hover:bg-red-200 text-red-700 rounded-lg p-2 transition-colors duration-200 shadow-sm disabled:opacity-50"
                            title="Delete Blog"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      )}

                      {/* Post Content */}
                      <Link href={`/posts/${post._id}`} className="block mb-4">
                        <p className="text-gray-600 line-clamp-3 text-sm leading-relaxed hover:text-gray-800 transition-colors">
                          {post.excerpt ||
                            post.content?.slice(0, 150) +
                              (post.content?.length > 150 ? "..." : "")}
                        </p>
                      </Link>

                      {/* Post Footer */}
                      <div className="mt-auto pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                />
                              </svg>
                              {wordCount} words
                            </span>
                          </div>
                          {post.updatedAt !== post.createdAt && (
                            <span className="text-purple-600 text-xs">
                              Updated
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
