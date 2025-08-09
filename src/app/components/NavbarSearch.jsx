"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NavbarSearch() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const router = useRouter();

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  // Search query
  const {
    data: searchResults,
    isLoading: isSearching,
    error: searchError,
  } = useQuery({
    queryKey: ["navbarSearchPosts", debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery.trim()) return null;

      const params = new URLSearchParams({
        q: debouncedQuery.trim(),
        limit: "5", // Limit to 5 results for navbar
      });

      const response = await fetch(`/api/posts/search?${params}`);
      if (!response.ok) {
        throw new Error("Search failed");
      }

      return response.json();
    },
    enabled: debouncedQuery.trim().length > 0,
    staleTime: 30000, // Cache results for 30 seconds
  });

  // Show/hide results based on search state
  useEffect(() => {
    setShowResults(isExpanded && debouncedQuery.trim().length > 0);
  }, [isExpanded, debouncedQuery]);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsExpanded(false);
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close search on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsExpanded(false);
        setShowResults(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const handleSearchIconClick = () => {
    setIsExpanded(true);
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setDebouncedQuery("");
    setShowResults(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleResultClick = () => {
    setIsExpanded(false);
    setShowResults(false);
    setSearchQuery("");
    setDebouncedQuery("");
  };

  const handleViewAllResults = () => {
    // Navigate to dashboard with search query
    router.push(`/dashboard?search=${encodeURIComponent(debouncedQuery)}`);
    setIsExpanded(false);
    setShowResults(false);
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Search Icon or Input */}
      <div className="flex items-center">
        {!isExpanded ? (
          // Search Icon
          <button
            onClick={handleSearchIconClick}
            className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/30"
            title="Search posts"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        ) : (
          // Expanded Search Input
          <div className="relative">
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 min-w-[300px]">
              <svg
                className="w-5 h-5 text-white/70 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={handleInputChange}
                className="flex-1 bg-transparent text-white placeholder-white/70 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="ml-2 text-white/70 hover:text-white"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute right-0 top-12 w-96 max-w-[90vw] bg-white rounded-xl shadow-2xl border border-gray-200 z-[60] max-h-80 overflow-hidden">
          <div className="p-3">
            {/* Loading State */}
            {isSearching && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                <span className="ml-2 text-gray-600">Searching...</span>
              </div>
            )}

            {/* Error State */}
            {searchError && (
              <div className="text-center py-8 text-red-600">
                Search failed. Please try again.
              </div>
            )}

            {/* Results */}
            {searchResults && !isSearching && (
              <>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Found {searchResults.totalCount} result
                  {searchResults.totalCount !== 1 ? "s" : ""}
                </div>

                {searchResults.posts.length > 0 ? (
                  <>
                    {searchResults.posts.map((post) => (
                      <Link
                        key={post._id}
                        href={`/posts/${post._id}`}
                        className="block p-3 hover:bg-gray-50 rounded-lg transition-colors mb-2"
                        onClick={handleResultClick}
                      >
                        <div className="font-medium text-gray-900 truncate mb-1">
                          {post.title}
                        </div>
                        <div className="text-sm text-gray-500 line-clamp-2">
                          {post.excerpt || post.content?.slice(0, 120) + "..."}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </div>
                      </Link>
                    ))}

                    {searchResults.totalCount > 5 && (
                      <button
                        onClick={handleViewAllResults}
                        className="w-full mt-2 p-2 text-sm text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors border-t border-gray-100"
                      >
                        View all {searchResults.totalCount} results →
                      </button>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No posts found for "{searchResults.query}"
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
