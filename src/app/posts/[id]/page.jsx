// /src/app/posts/[id]/page.jsx
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/post";
import { notFound } from "next/navigation";

// Enable static generation with ISR for better performance
export const revalidate = 300; // Revalidate every 5 minutes

export default async function BlogPost({ params }) {
  const asyncParams = await params;

  // Query database directly instead of making API call
  await connectDB();
  const post = await Post.findById(asyncParams.id).lean(); // .lean() for better performance

  if (!post) {
    notFound();
  }

  // Calculate reading time and word count
  const wordCount = post.content?.split(" ").length || 0;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 text-white py-12 md:py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-2xl md:text-4xl lg:text-6xl font-extrabold mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-200 via-pink-200 to-blue-200 leading-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 text-purple-200">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{readingTime} min read</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                <span>{wordCount} words</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
        <article className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-6 md:p-8 lg:p-12">
            <div className="prose prose-base md:prose-lg prose-gray max-w-none">
              <div className="text-gray-700 text-base md:text-lg leading-relaxed whitespace-pre-line">
                {post.content}
              </div>
            </div>
          </div>

          {/* Article Footer */}
          <div className="bg-gray-50 px-6 md:px-8 lg:px-12 py-4 md:py-6 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-xs md:text-sm text-gray-500 text-center sm:text-left">
                Published on{" "}
                {new Date(post.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                {post.updatedAt !== post.createdAt && (
                  <span className="block sm:inline sm:ml-2 text-purple-600">
                    • Updated {new Date(post.updatedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
              <div className="flex justify-center sm:justify-end">
                <a
                  href="/dashboard"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-4 md:px-6 py-2 md:py-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 text-sm md:text-base"
                >
                  <svg
                    className="w-3 md:w-4 h-3 md:h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Back to Posts
                </a>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
