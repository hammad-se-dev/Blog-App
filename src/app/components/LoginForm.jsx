'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); //Loading State
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true); // 👈 start loading

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false) // 👈 stop loading after response

    if (error) {
      setError(error.message);
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  };
  const handleGoogleSignin = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white/90 p-8 rounded-3xl shadow-2xl border border-indigo-100">
      <form
        onSubmit={handleLogin}
        className="space-y-6"
      >
        <h2 className="text-2xl font-extrabold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 tracking-tight drop-shadow">
          Login
        </h2>
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-indigo-700 mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            className="w-full px-4 py-3 border-2 border-indigo-100 rounded-xl bg-indigo-50 placeholder:text-indigo-300 text-lg focus:outline-none focus:ring-2 focus:ring-pink-100 focus:border-pink-400 transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-indigo-700 mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            className="w-full px-4 py-3 border-2 border-indigo-100 rounded-xl bg-indigo-50 placeholder:text-indigo-300 text-lg focus:outline-none focus:ring-2 focus:ring-pink-100 focus:border-pink-400 transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>
        {error && <p className="text-sm text-red-500 text-center font-semibold">{error}</p>}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white font-bold py-3 rounded-xl shadow-lg hover:from-indigo-700 hover:to-pink-600 transition-all duration-200 text-lg flex justify-center items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          )}
          {loading ? 'Logging in...' : 'Log In'}
        </button>
        {/* signin with google */}
        <button
          type="button"
          onClick={handleGoogleSignin}
          className="w-full flex items-center justify-center gap-3 py-3 mt-2 rounded-xl border border-gray-300 bg-white text-gray-700 font-semibold shadow hover:shadow-md transition-all duration-150 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <svg className="w-5 h-5" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_17_40)">
              <path d="M47.532 24.552c0-1.636-.146-3.2-.418-4.704H24.48v9.02h13.02c-.56 3.02-2.24 5.58-4.78 7.3v6.06h7.74c4.54-4.18 7.07-10.34 7.07-17.676z" fill="#4285F4"/>
              <path d="M24.48 48c6.48 0 11.92-2.14 15.89-5.82l-7.74-6.06c-2.14 1.44-4.88 2.3-8.15 2.3-6.26 0-11.56-4.22-13.46-9.9H2.5v6.22C6.46 43.78 14.7 48 24.48 48z" fill="#34A853"/>
              <path d="M11.02 28.52c-.48-1.44-.76-2.98-.76-4.52s.28-3.08.76-4.52v-6.22H2.5A23.97 23.97 0 000 24c0 3.98.96 7.76 2.5 11.22l8.52-6.7z" fill="#FBBC05"/>
              <path d="M24.48 9.54c3.54 0 6.68 1.22 9.16 3.62l6.84-6.84C36.4 2.14 30.96 0 24.48 0 14.7 0 6.46 4.22 2.5 10.78l8.52 6.22c1.9-5.68 7.2-9.9 13.46-9.9z" fill="#EA4335"/>
            </g>
            <defs>
              <clipPath id="clip0_17_40">
                <rect width="48" height="48" fill="white"/>
              </clipPath>
            </defs>
          </svg>
          <span>Log in with Google</span>
        </button>
        <p className="text-sm text-center text-gray-600 mt-4">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-indigo-600 hover:underline font-semibold">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
