// app/page.jsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    };

    checkSession();
  }, [router]);

  return <p>Loading...</p>;
}
