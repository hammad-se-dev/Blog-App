
import { getPostById } from '../../data/posts';
import { notFound } from 'next/navigation';

export default async function Post({ params }) {
  const post = await getPostById(params.id);

  if (!post) {
    notFound();
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-4">{post.title}</h2>
      <p className="text-gray-600 mb-4">{post.content}</p>
      <a href="/" className="text-blue-600 hover:underline">Back to Home</a>
    </div>
  );
}

