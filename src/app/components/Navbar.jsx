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

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-400 text-white px-8 py-4 shadow-xl rounded-b-2xl">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-pink-100 drop-shadow-lg mb-2 sm:mb-0">
          My Blog
        </h1>
        <div className="flex items-center gap-6">
          <Link href="/" className="hover:underline hover:text-pink-200 transition duration-200 text-lg font-medium">
            Home
          </Link>
          <Link href="/about" className="hover:underline hover:text-pink-200 transition duration-200 text-lg font-medium">
            About
          </Link>
          {session && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
              title="Logout"
            >
              <LogOutIcon className='w-5 h-5' />
              <span className="hidden sm:inline font-semibold">Logout</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
