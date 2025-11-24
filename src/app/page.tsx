"use client";

import Link from "next/link";
import type { Posts } from "@/app/_types";
import { useFetch } from "@/app/_hooks/useFetch";

export default function PostList() {
  // SWRでデータ取得
  const { data, error, isLoading } = useFetch<{ posts: Posts[] }>("/api/posts");

  if (isLoading) return <p>読み込み中...</p>;
  if (error) return <p>読み込みエラー</p>;
  
  const posts = data?.posts ?? []; // SWR は data が最初 undefined になる

  return (
    <div>
      {posts.map((post) => (
        <Link key={post.id} href={`/posts/${post.id}`}>
          <div className="border p-4 m-2">
            <h2 className="text-xl font-bold">{post.title}</h2>
            <p>{post.content}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}