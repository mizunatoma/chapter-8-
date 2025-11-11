"use client";

import useSWR from "swr";
import Link from "next/link";
import { Posts } from "@/app/_types"
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

const fetcher = async (url: string, token: string) => {
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  });

  if (!res.ok) {
    throw new Error("データ取得に失敗しました");
  }

  const data = await res.json();
  return data.posts as Posts[];
};

export default function AdminPostsPage() {
  const { token } = useSupabaseSession();
  
  const { data: posts, error, isLoading, mutate } = useSWR(
    token ? ["/api/admin/posts", token] : null, 
    ([url, token]) => fetcher(url, token)
  )
  
  if (isLoading) return <p>読み込み中...</p>;
  if (error) return <p>エラーが発生しました...</p>;

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