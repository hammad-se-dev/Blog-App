'use client';
import '@/app/globals.css';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { LogOutIcon } from 'lucide-react';

function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // Check if user is logged in by looking for token and user data
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      try {
        const userData = JSON.parse(user);
        setUserInfo(userData);
        setIsLoggedIn(true);
        console.log('Navbar - User logged in:', userData); // Debug log
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Clear invalid data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
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
      if (e.key === 'token' || e.key === 'user') {
        // Recheck authentication status
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        
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

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = async () => {
    try {
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Update state
      setIsLoggedIn(false);
      setUserInfo(null);
      setShowProfile(false);
      
      // Redirect to login
      router.push('/login');
      router.refresh();
      
      console.log('User logged out successfully'); // Debug log
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleProfileClick = () => {
    setShowProfile((prev) => !prev);
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfile && !event.target.closest('.profile-dropdown')) {
        setShowProfile(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfile]);

  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-400 text-white px-8 py-4 shadow-xl rounded-b-2xl">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-pink-100 drop-shadow-lg mb-2 sm:mb-0">
          My Blog
        </h1>
        <div className="flex items-center gap-6 relative">
          <Link href="/" className="hover:underline hover:text-pink-200 transition duration-200 text-lg font-medium">
            Home
          </Link>
          {/* <Link href="/dashboard" className="hover:underline hover:text-pink-200 transition duration-200 text-lg font-medium">
            Dashboard
          </Link> */}
          <Link href="/about" className="hover:underline hover:text-pink-200 transition duration-200 text-lg font-medium">
            About
          </Link>
          
          {/* Show login/signup links when not logged in */}
          {!isLoggedIn ? (
            <>
              <Link href="/login" className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full transition-colors duration-200 text-lg font-medium">
                Login
              </Link>
              <Link href="/signup" className="bg-white hover:bg-white/90 text-indigo-600 px-4 py-2 rounded-full transition-colors duration-200 text-lg font-medium">
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
                  {userInfo?.email?.[0]?.toUpperCase() || 'U'}
                </span>
                <span className="hidden sm:inline font-semibold">Profile</span>
                <svg 
                  className={`w-4 h-4 transition-transform duration-200 ${showProfile ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showProfile && (
                <div className="absolute right-0 top-12 bg-white text-indigo-900 rounded-lg shadow-lg p-4 min-w-[220px] z-50 border border-indigo-100">
                  <div className="flex flex-col items-center gap-2">
                    <span className="w-16 h-16 rounded-full bg-indigo-200 flex items-center justify-center font-bold text-2xl text-indigo-900">
                      {userInfo?.email?.[0]?.toUpperCase() || 'U'}
                    </span>
                    <div className="font-semibold text-lg text-center">
                      {userInfo?.email?.split('@')[0] || 'User'}
                    </div>
                    <div className="text-sm text-indigo-700 text-center break-all">
                      {userInfo?.email}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      User ID: {userInfo?.id?.slice(-8) || 'Unknown'}
                    </div>
                  </div>
                  
                  <hr className="my-3 border-indigo-100" />
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 px-3 py-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-300"
                    title="Logout"
                  >
                    <LogOutIcon className='w-5 h-5' />
                    <span className="font-semibold">Logout</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
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