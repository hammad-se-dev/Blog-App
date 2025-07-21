// components/LoginForm.jsx
'use client'; // This is a client component

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setError(error.message);
    } else {
      // **Successful login! Redirect to the protected page.**
      router.push('/dashboard'); // The "certain screen" you wanted
      router.refresh(); // Recommended to re-fetch server-side data
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
      <button type="submit">Log In</button>
      <p>Dont have an account? <Link href='/signup'>Signup now!</Link></p>
      {error && <p style={{ color: 'red' }}>{error}</p>}

    </form>
  );
}