// /src/app/posts/[id]/page.jsx
import { getPostById } from '../../data/posts';
import { notFound } from 'next/navigation';

export default async function Post({ params }) {
  const asyncParams = await params;
  const post = await getPostById(asyncParams.id);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 py-12 px-4">
      <div className="w-full max-w-2xl bg-white/90 p-10 rounded-3xl shadow-2xl border border-indigo-100">
        <h2 className="text-4xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 tracking-tight drop-shadow">
          {post.title}
        </h2>
        <p className="text-gray-700 mb-8 text-lg leading-relaxed whitespace-pre-line">
          {post.content}
        </p>
        <a href="/" className="inline-block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:from-indigo-700 hover:to-pink-600 transition-all duration-200 text-lg">
          &larr; Back to Home
        </a>
      </div>
    </div>
  );
}

