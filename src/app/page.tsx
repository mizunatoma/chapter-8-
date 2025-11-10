"use client";

import Link from "next/link";
import { Posts } from "@/app/_types";
import useSWR from 'swr';

// fetcher関数: SWRがurlを自動で渡してくる
// useSWRの外で定義する
const fetcher = async (url: string) => {
  const res = await fetch(url); // urlはSWRがくれる
  if(!res.ok) throw new Error("APIエラー");
  return res.json(); // Jsonデータを返す
};

export default function PostList() {
  // SWRでデータ取得
  const { data, error, isLoading } = useSWR('/api/posts', fetcher);

  if (isLoading) return <p>読み込み中...</p>;
  if (error) return <p>読み込みエラー</p>;
  
  const posts: Posts[] = data.posts;

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