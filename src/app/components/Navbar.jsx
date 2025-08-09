"use client";
import "@/app/globals.css";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { LogOutIcon } from "lucide-react";
import NavbarSearch from "./NavbarSearch";

function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check if user is logged in by looking for token and user data
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      try {
        const userData = JSON.parse(user);
        setUserInfo(userData);
        setIsLoggedIn(true);
        console.log("Navbar - User logged in:", userData); // Debug log
      } catch (error) {
        console.error("Error parsing user data:", error);
        // Clear invalid data
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        setUserInfo(null);
      }
    } else {
      setIsLoggedIn(false);
      setUserInfo(null);
    }
  }, []); // Only run on mount

  // Listen for storage changes (when user logs in/out in another tab)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "token" || e.key === "user") {
        // Recheck authentication status
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");

        if (token && user) {
          try {
            const userData = JSON.parse(user);
            setUserInfo(userData);
            setIsLoggedIn(true);
          } catch (error) {
            setIsLoggedIn(false);
            setUserInfo(null);
          }
        } else {
          setIsLoggedIn(false);
          setUserInfo(null);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = async () => {
    try {
      // Clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Update state
      setIsLoggedIn(false);
      setUserInfo(null);
      setShowProfile(false);

      // Redirect to login
      router.push("/login");
      router.refresh();

      console.log("User logged out successfully"); // Debug log
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleProfileClick = () => {
    setShowProfile((prev) => !prev);
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfile && !event.target.closest(".profile-dropdown")) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showProfile]);

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white px-4 md:px-8 py-4 md:py-6 shadow-2xl border-b border-purple-500/20 backdrop-blur-lg">
      <div className="container mx-auto flex flex-wrap justify-between items-center">
        {/* Logo Section - Make it clickable to go to dashboard */}
        <Link
          href="/dashboard"
          className="flex items-center gap-3 mb-2 sm:mb-0 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 md:w-10 h-8 md:h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl flex items-center justify-center shadow-lg">
            <svg
              className="w-5 md:w-6 h-5 md:h-6 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z"
                clipRule="evenodd"
              />
              <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V9a1 1 0 00-1-1h-1v3a2 2 0 11-4 0V9a1 1 0 00-1-1H7v3a2 2 0 11-4 0V9a2 2 0 012-2h1V5a2 2 0 012-2h8a2 2 0 012 2v2z" />
            </svg>
          </div>
          <h1 className="text-xl md:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 drop-shadow-lg">
            BlogSpace
          </h1>
        </Link>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          {/* Mobile Search Icon */}
          <div className="lg:hidden">
            <NavbarSearch />
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
            aria-label="Toggle mobile menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Navigation Links - Desktop */}
        <div className="hidden md:flex items-center gap-2 relative">
          <Link
            href="/about"
            className="px-4 py-2 rounded-full hover:bg-white/10 transition-all duration-300 text-lg font-medium hover:text-purple-200 hover:shadow-lg transform hover:scale-105"
          >
            About
          </Link>

          {/* Search functionality - Hidden on small screens */}
          <div className="hidden lg:block">
            <NavbarSearch />
          </div>

          {/* Auth Links - Desktop */}
          {!isLoggedIn ? (
            <>
              <Link
                href="/login"
                className="bg-white/10 hover:bg-white/20 text-white px-4 md:px-6 py-2 md:py-2.5 rounded-full transition-all duration-300 font-medium backdrop-blur-sm border border-white/20 hover:border-white/40 hover:shadow-lg transform hover:scale-105 text-sm md:text-base"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 md:px-6 py-2 md:py-2.5 rounded-full transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 border border-purple-400/50 text-sm md:text-base"
              >
                Sign Up
              </Link>
            </>
          ) : (
            /* Show profile dropdown when logged in */
            <div className="relative profile-dropdown">
              <button
                onClick={handleProfileClick}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                title="Profile"
              >
                <span className="w-7 h-7 rounded-full bg-indigo-300 flex items-center justify-center font-bold text-indigo-900">
                  {userInfo?.email?.[0]?.toUpperCase() || "U"}
                </span>
                <span className="hidden sm:inline font-semibold">Profile</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${
                    showProfile ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {showProfile && (
                <div className="absolute right-0 top-12 bg-white text-indigo-900 rounded-lg shadow-lg p-4 min-w-[220px] z-50 border border-indigo-100">
                  <div className="flex flex-col items-center gap-2">
                    <span className="w-16 h-16 rounded-full bg-indigo-200 flex items-center justify-center font-bold text-2xl text-indigo-900">
                      {userInfo?.email?.[0]?.toUpperCase() || "U"}
                    </span>
                    <div className="font-semibold text-lg text-center">
                      {userInfo?.email?.split("@")[0] || "User"}
                    </div>
                    <div className="text-sm text-indigo-700 text-center break-all">
                      {userInfo?.email}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      User ID: {userInfo?.id?.slice(-8) || "Unknown"}
                    </div>
                  </div>

                  <hr className="my-3 border-indigo-100" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 px-3 py-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-300"
                    title="Logout"
                  >
                    <LogOutIcon className="w-5 h-5" />
                    <span className="font-semibold">Logout</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden w-full mt-4 py-4 border-t border-purple-500/20">
            <div className="flex flex-col space-y-3">
              <Link
                href="/about"
                className="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors duration-200 text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>

              {!isLoggedIn ? (
                <div className="flex flex-col space-y-2 px-4">
                  <Link
                    href="/login"
                    className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full transition-all duration-300 font-medium backdrop-blur-sm border border-white/20 text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-full transition-all duration-300 font-medium shadow-lg text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <div className="px-4">
                  <div className="flex items-center gap-3 mb-3 p-3 bg-white/10 rounded-lg">
                    <span className="w-10 h-10 rounded-full bg-purple-300 flex items-center justify-center font-bold text-purple-900">
                      {userInfo?.email?.[0]?.toUpperCase() || "U"}
                    </span>
                    <div>
                      <div className="font-semibold">
                        {userInfo?.email?.split("@")[0] || "User"}
                      </div>
                      <div className="text-sm text-purple-200">
                        {userInfo?.email}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full transition-colors duration-200"
                  >
                    <LogOutIcon className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Debug info - remove in production
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs bg-black/20 px-2 py-1 rounded mt-2">
          Debug: Logged in: {isLoggedIn.toString()} | User: {userInfo?.email || 'None'}
        </div>
      )} */}
    </nav>
  );
}

export default Navbar;
