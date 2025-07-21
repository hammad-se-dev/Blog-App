'use client';

import React from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

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
    <nav className="bg-blue-600 text-white px-6 py-4 shadow-md">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-2xl font-bold mb-2 sm:mb-0">My Blog</h1>
        <div className="flex items-center gap-4">
          <Link href="/" className="hover:underline transition duration-200">
            Home
          </Link>
          <Link href="/about" className="hover:underline transition duration-200">
            About
          </Link>
          {session && (
          <button
            onClick={handleLogout}
            className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100 transition"
          >
            Logout
          </button>
        )}

        </div>
      </div>
    </nav>
  );
}

export default Navbar;
