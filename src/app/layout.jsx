import Link from 'next/link';
import './globals.css';
import Navbar from './components/Navbar'

export const metadata = {
  title: 'My Next.js Blog',
  description: 'A simple blog built with Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100">
        <header className="bg-blue-600 text-white p-4">
          <Navbar/>
        </header>
        <main className="container mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}