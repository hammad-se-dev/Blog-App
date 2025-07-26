import Link from 'next/link';
import './globals.css';
import Navbar from './components/Navbar'
import ReactQueryProvider from './components/ReactQueryProvider';

export const metadata = {
  title: 'My Next.js Blog',
  description: 'A simple blog built with Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <ReactQueryProvider>
        <div className="sticky top-0 z-50 bg-white shadow-md">
            <Navbar />
          </div>          <main className="container mx-auto p-4">
            {children}
          </main>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
