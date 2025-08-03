// app/auth/callback/page.js
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const userString = searchParams.get('user');
    const error = searchParams.get('error');

    if (error) {
      // Handle error
      router.push('/login?error=oauth_failed');
      return;
    }

    if (token && userString) {
      try {
        // Store the token and user data
        localStorage.setItem('token', token);
        localStorage.setItem('user', userString);
        
        // Redirect to dashboard
        router.push('/dashboard');
      } catch (err) {
        console.error('Error storing auth data:', err);
        router.push('/login?error=storage_failed');
      }
    } else {
      // Missing required data
      router.push('/login?error=invalid_callback');
    }
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Completing sign in...</h2>
        <p className="text-gray-500">Please wait while we redirect you.</p>
      </div>
    </div>
  );
}