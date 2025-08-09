"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export default function SearchBar({ userId = null, onResultsUpdate = null }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Search query
  const {
    data: searchResults,
    isLoading: isSearching,
    error: searchError,
  } = useQuery({
    queryKey: ["searchPosts", debouncedQuery, userId],
    queryFn: async () => {
      if (!debouncedQuery.trim()) return null;

      const params = new URLSearchParams({
        q: debouncedQuery.trim(),
        limit: "10",
      });

      if (userId) {
        params.append("userId", userId);
      }

      const response = await fetch(`/api/posts/search?${params}`);
      if (!response.ok) {
        throw new Error("Search failed");
      }

      return response.json();
    },
    enabled: debouncedQuery.trim().length > 0,
    staleTime: 30000, // Cache results for 30 seconds
  });

  // Update parent component with search results
  useEffect(() => {
    if (onResultsUpdate) {
      onResultsUpdate(searchResults, debouncedQuery);
    }
  }, [searchResults, debouncedQuery, onResultsUpdate]);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    setDebouncedQuery("");
    setIsSearchActive(false);
    if (onResultsUpdate) {
      onResultsUpdate(null, "");
    }
  }, [onResultsUpdate]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim().length > 0) {
      setIsSearchActive(true);
    } else {
      setIsSearchActive(false);
      if (onResultsUpdate) {
        onResultsUpdate(null, "");
      }
    }
  };

  return (
    <div className="relative w-full max-w-md">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search blog posts..."
          value={searchQuery}
          onChange={handleInputChange}
          className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
        />

        {/* Clear button */}
        {searchQuery && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button
              type="button"
              onClick={handleClearSearch}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Search Status */}
      {isSearchActive && (
        <div className="mt-2 text-sm text-gray-600">
          {isSearching && (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
              Searching...
            </div>
          )}

          {searchError && (
            <div className="text-red-600">Search failed. Please try again.</div>
          )}

          {searchResults && !isSearching && (
            <div className="text-gray-500">
              Found {searchResults.totalCount} result
              {searchResults.totalCount !== 1 ? "s" : ""} for "
              {searchResults.query}"
            </div>
          )}
        </div>
      )}

      {/* Quick Results Preview (optional - shows first few results) */}
      {isSearchActive && searchResults && searchResults.posts.length > 0 && (
        <div className="absolute z-50 mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-200 max-h-80 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2">
              Quick Results
            </div>
            {searchResults.posts.slice(0, 5).map((post) => (
              <Link
                key={post._id}
                href={`/posts/${post._id}`}
                className="block px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setIsSearchActive(false)}
              >
                <div className="font-medium text-gray-900 truncate">
                  {post.title}
                </div>
                <div className="text-sm text-gray-500 truncate">
                  {post.excerpt || post.content?.slice(0, 100)}
                </div>
              </Link>
            ))}
            {searchResults.totalCount > 5 && (
              <div className="px-3 py-2 text-sm text-indigo-600 border-t border-gray-100">
                +{searchResults.totalCount - 5} more results
              </div>
            )}
          </div>
        </div>
      )}

      {/* No Results */}
      {isSearchActive &&
        searchResults &&
        searchResults.posts.length === 0 &&
        !isSearching && (
          <div className="absolute z-50 mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-200 p-4">
            <div className="text-center text-gray-500">
              No posts found for "{searchResults.query}"
            </div>
          </div>
        )}
    </div>
  );
}
