import Link from 'next/link';
import './globals.css';

export const metadata = {
  title: 'My Next.js Blog',
  description: 'A simple blog built with Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100">
        <header className="bg-blue-600 text-white p-4">
          <nav className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">My Blog</h1>
            <div>
              <Link href="/" className="mr-4 hover:underline">Home</Link>
              <Link href="/about" className="hover:underline">About</Link>
            </div>
          </nav>
        </header>
        <main className="container mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}