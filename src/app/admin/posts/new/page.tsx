"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Category } from "@/app/_types"
import { PostForm } from '../_components/PostForm'
import type { CreatePostRequestBody } from "@/app/api/admin/posts/route"; 
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";


export default function NewPostPage() {
  const router = useRouter();  // ページ遷都のリモコン
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailUrl, setThumbnailImageKey] = useState('https://placehold.jp/800x400.png');
  const [categories, setCategories] = useState<Partial<Category>[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token } = useSupabaseSession()

// ===============================
// POST (create)
// ===============================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault() // フォーム送信時のデフォルト動作（ページ再読み込み）を防止
    setIsSubmitting(true);
    if (!token) return;

    try {
      // idのみ抽出して型整合を取る
      const categoryIds = categories.map((c) => ({ id: c.id! }));
      const body: CreatePostRequestBody = {
        title,
        content,
        thumbnailUrl,
        categories: categoryIds,
      };

      const res = await fetch('/api/admin/posts/', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json', // JSONを送ることを明示
          Authorization: token, // APIの利用制限
        },  
        body: JSON.stringify(body),
      })

      const { id } = await res.json();  // { id: 3 }
      router.push(`/admin/posts/${id}`);  // 記事作成後、編集ページへ遷都
      alert('記事を作成しました');
    } catch (error) {
      console.error("データ作成エラー：", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <PostForm
        mode="new"
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        thumbnailUrl={thumbnailUrl}
        setThumbnailImageKey={setThumbnailImageKey}
        categories={categories}
        setCategories={setCategories}        
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />      
    </div>
  );
}