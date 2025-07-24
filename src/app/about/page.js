export default function About() {
  return (
    <main className="container mx-auto p-4 min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white/90 p-10 rounded-3xl shadow-2xl border border-indigo-100 text-center">
        <h2 className="text-4xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 tracking-tight drop-shadow">
          About This Blog
        </h2>
        <p className="text-gray-600 text-lg leading-relaxed mb-6">
          This is a simple blog built with Next.js to demonstrate Server Components, Client Components, and the App Router.
        </p>
        <div className="flex justify-center my-8">
          <div className="w-1/2 h-1 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 rounded-full" />
        </div>
        <p className="text-indigo-700 font-semibold">
          Built with ❤️ using Next.js, Supabase, and TanStack Query.
        </p>
      </div>
    </main>
  );
}