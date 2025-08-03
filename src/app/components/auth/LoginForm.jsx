'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
  
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await res.json();
      setLoading(false);
  
      if (!res.ok) return setError(data.error);
      
      // Store both token and user data properly
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        id: data.userId,
        email: email
      }));
      
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError('Something went wrong.');
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setGoogleLoading(true);

    try {
      // Redirect to Google OAuth endpoint
      window.location.href = "/api/auth/google?type=login";
    } catch (err) {
      setError("Google login failed.");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white/90 p-8 rounded-3xl shadow-2xl border border-indigo-100">
      <form onSubmit={handleLogin} className="space-y-6">
        <h2 className="text-2xl font-extrabold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 tracking-tight drop-shadow">
          Login
        </h2>

        {/* Google Login Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={googleLoading || loading}
          className="w-full bg-white border-2 border-gray-300 text-gray-700 font-semibold py-3 rounded-xl shadow-md hover:shadow-lg hover:border-gray-400 transition-all duration-200 text-lg flex justify-center items-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {googleLoading ? (
            <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          )}
          {googleLoading ? "Signing in..." : "Continue with Google"}
        </button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white/90 text-gray-500 font-medium">Or continue with email</span>
          </div>
        </div>

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
          disabled={loading || googleLoading}
        >
          {loading && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          )}
          {loading ? 'Logging in...' : 'Log In'}
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