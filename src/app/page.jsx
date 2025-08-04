'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Loader from './components/Loader'; // Custom loader component

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = () => {
      const token = localStorage.getItem('token');
      if (token) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    };

    checkSession();
  }, [router]);

  return (

    <div className="min-h-screen flex items-center justify-center ">
      <Loader />
    </div>
  );
}
