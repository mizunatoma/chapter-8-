"use client";

import { useFetch } from "@/app/_hooks/useFetch";
import Link from "next/link";
import { Posts } from "@/app/_types"

// ===============================
// GET
// ===============================
export default function AdminPostsPage() {
  const { data, error, isLoading } = useFetch<{ posts: Posts[] }>(
    "/api/admin/posts"
  );
  
  if (isLoading) return <p>読み込み中...</p>;
  if (error) return <p>エラー: {error.message}</p>;

  const posts = data?.posts ?? [];

  return (
    <div>
      <div className="flex justify-between items-center"> 
        <h2 className="text-xl font-bold text-gray-800 mb-2">記事一覧</h2>
        <Link
          href="/admin/posts/new"  
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-sm"
        >
          新規作成
        </Link>
      </div>

      <div>
        {posts?.map((post) => (
          <Link 
            key={post.id} 
            href={`/admin/posts/${post.id}`}
            className="border-b block pb-2 hover:bg-gray-200 "
          >
              <h2 className="text-base font-semibold text-gray-900 mb-1">{post.title}</h2>
              <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString("ja-JP")}</p>
          </Link>
        ))}
      </div>

    </div>
  );
}