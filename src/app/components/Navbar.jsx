'use client';
import '@/app/globals.css';
import React from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { LogOutIcon } from 'lucide-react';
import useBlogStore from '@/lib/useBlogStore'; // Adjust path as needed

function Navbar() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session?.user) {
        setUserInfo(data.session.user);
      }
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleProfileClick = () => {
    setShowProfile((prev) => !prev);
  };

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
          <Link href="/about" className="hover:underline hover:text-pink-200 transition duration-200 text-lg font-medium">
            About
          </Link>
          {session && (
            <>
              <button
                onClick={handleProfileClick}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                title="Profile"
              >
                {userInfo?.user_metadata?.avatar_url ? (
                  <img src={userInfo.user_metadata.avatar_url} alt="avatar" className="w-7 h-7 rounded-full border-2 border-white" />
                ) : (
                  <span className="w-7 h-7 rounded-full bg-indigo-300 flex items-center justify-center font-bold text-indigo-900">{userInfo?.email?.[0]?.toUpperCase() || 'U'}</span>
                )}
                <span className="hidden sm:inline font-semibold">Profile</span>
              </button>
              {showProfile && (
                <div className="absolute right-0 top-12 bg-white text-indigo-900 rounded-lg shadow-lg p-4 min-w-[220px] z-50">
                  <div className="flex flex-col items-center gap-2">
                    {userInfo?.user_metadata?.avatar_url ? (
                      <img src={userInfo.user_metadata.avatar_url} alt="avatar" className="w-16 h-16 rounded-full border-2 border-indigo-400" />
                    ) : (
                      <span className="w-16 h-16 rounded-full bg-indigo-200 flex items-center justify-center font-bold text-2xl text-indigo-900">{userInfo?.email?.[0]?.toUpperCase() || 'U'}</span>
                    )}
                    <div className="font-semibold text-lg">{userInfo?.user_metadata?.full_name || userInfo?.email}</div>
                    <div className="text-sm text-indigo-700">{userInfo?.email}</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="mt-4 w-full flex items-center gap-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-900 px-3 py-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
                    title="Logout"
                  >
                    <LogOutIcon className='w-5 h-5' />
                    <span className="font-semibold">Logout</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
