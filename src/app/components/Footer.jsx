export default function Footer() {
  return (
    <footer className="bg-gradient-to-l from-indigo-600 via-purple-600 to-pink-400 text-white py-4 mt-8 shadow-inner rounded-t-2xl">
      <div className="container mx-auto text-center text-sm">
        &copy; {new Date().getFullYear()} My Next.js Blog. All rights reserved.
      </div>
    </footer>
  );
}
