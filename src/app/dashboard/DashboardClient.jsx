"use client";

import { useState, useEffect } from "react";
import AddBlogForm from "../components/AddBlogForm";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";

export default function DashboardClient() {
  const [showForm, setShowForm] = useState(false);
  const [showMyBlogs, setShowMyBlogs] = useState(false);
  const [userId, setUserId] = useState(null);
  const [postToEdit, setPostToEdit] = useState(null); // New state
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) setUserId(data.user.id);
    };
    fetchUser();
  }, []);

  const {
    data: postList = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["posts", showMyBlogs, userId],
    queryFn: async () => {
      if (showMyBlogs) {
        if (!userId) return [];
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .eq("user_id", userId)
          .order("id", { ascending: false });
        if (error) throw new Error(error.message);
        return data || [];
      } else {
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .order("id", { ascending: false });
        if (error) throw new Error(error.message);
        return data || [];
      }
    },
    enabled: showMyBlogs ? !!userId : true,
  });

  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: async (postId) => {
      const { error } = await supabase.from("posts").delete().eq("id", postId);
      if (error) throw new Error(error.message);
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
    <main className="container mx-auto p-4 min-h-screen ">
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
              }`}
            onClick={() => setShowMyBlogs((prev) => !prev)}
            disabled={!userId}
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
              setPostToEdit(null); // clear edit state
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
          No blog posts yet.
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 items-stretch">
          {postList.map((post) => (
            <div key={post.id} className="relative group h-full">
              <div className="h-full flex flex-col justify-between bg-white/90 p-6 rounded-3xl shadow-xl border border-indigo-100 group relative overflow-hidden transition-all duration-200 hover:scale-[1.025] hover:shadow-2xl hover:border-pink-200">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-2xl font-bold text-indigo-700 group-hover:text-pink-600 transition-colors duration-200 pr-4">
                    <Link href={`/posts/${post.id}`}>{post.title}</Link>
                  </h3>
                  {showMyBlogs && post.user_id === userId && (
                    <div className="flex gap-2 flex-shrink-0">
                      {/* Edit Button */}
                      <button
                        onClick={() => handleEdit(post)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-2 shadow-lg"
                        title="Edit Blog"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.232 5.232l3.536 3.536M9 11l6-6m2 2L9 15H7v-2l8-8z"
                          />
                        </svg>
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(post.id)}
                        disabled={isDeleting}
                        className="bg-pink-600 hover:bg-pink-700 text-white rounded-full p-2 shadow-lg"
                        title="Delete Blog"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>

                <Link href={`/posts/${post.id}`}>
                  <p className="text-gray-600 mb-5 line-clamp-3 min-h-[60px] text-base leading-relaxed">
                    {post.excerpt ||
                      post.content?.slice(0, 100) +
                        (post.content?.length > 100 ? "..." : "")}
                  </p>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
