"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Posts } from "@/app/_types";
import { supabase } from '@/utils/supabase';

export default function PostDetail() {
  const { id } = useParams(); 
  const [post, setPost] = useState<Posts | null>(null);
  const [loading, setLoading] = useState(true);

  const [thumbnailImageKey, setThumbnailImageKey] = useState<string>("");
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetcher = async () => {
      try {
        const res = await fetch(`/api/posts/${id}`)
        const data = await res.json()
        setPost(data.post) // PostsResponseのpost
        setThumbnailImageKey(data.post.thumbnailImageKey ?? ""); // keyをstateに格納
      } catch (error) {
        console.error("データ取得エラー:", error);
      } finally {
        setLoading(false); // 読み込み完了
      }
    }
    fetcher();
  }, [id]); // idが変わるたびに再描画


// ■ 3. Supabaseから画像URL取得
  useEffect(() => {
    if (!thumbnailImageKey) return

    // ■ 2のアップロード処理のレスポンスで取得したthumbnailImageKeyを引数に、画像のURLを取得
    const fetcher = async () => {
      const { data: { publicUrl }} = await supabase.storage
        .from(`post_thumbnail`)
        .getPublicUrl(thumbnailImageKey)

      setThumbnailImageUrl(publicUrl)
    }
    fetcher()
  }, [thumbnailImageKey])

  if (loading) return <p>読み込み中...</p>
  if (!post) return <p className="text-red-600">記事が見つかりません</p>;
  
  return (
    <article className="max-w-3x1 mx-auto p-6">
      <Image
        src={thumbnailImageUrl || "https://placehold.jp/800x400.png"}
        alt={`${post.title}`}
        width={800}
        height={400}
        className="w-full rounded-lg mb-6"
      />

      <div className="flex justify-between items-center mb-6">    
        <p className="text-sm text-gray-500">
          {new Date(post.createdAt).toLocaleDateString()}
        </p>
        <div className="flex gap-2">
          {post.postCategories.map((cat, index) => (
            <span
              key={index}
              className="px-3 py-1 text-sm border border-blue-500 text-blue-600 rounded"
            >
              {cat.category.name}
            </span>
          ))}
        </div>
      </div>

      <h1 className="text-3x1 font-bold mb-4">{post.title}</h1>

      <div
        className="prose max-w-none text-gray-700 leading-relaxed"
        dangerouslySetInnerHTML={{__html: post.content}}
      />
    </article>
  );
}