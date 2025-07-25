'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function SignUpForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false)
  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      setLoading(false)
      alert('Success! Please check your email to confirm your account.');
      router.push('/login');
    }
  };

  const handleGoogleSignup = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white/90 p-8 rounded-3xl shadow-2xl border border-indigo-100">
      <form
        onSubmit={handleSignUp}
        className="space-y-6"
      >
        <h2 className="text-2xl font-extrabold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 tracking-tight drop-shadow">
          Sign Up
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
          {loading ? 'Creating Account...' : 'Signup'}
        </button>
        <button
          type="button"
          onClick={handleGoogleSignup}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
        >
          Sign up with Google
        </button>
        <p className="text-sm text-center text-gray-600 mt-4">
          Already have an account?{' '}
          <a href="/login" className="text-indigo-600 hover:underline font-semibold">
            Log in
          </a>
        </p>
      </form>
    </div>
  );
}
