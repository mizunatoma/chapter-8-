"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type { Posts } from "@/app/_types/";
import { Category } from '@/app/_types/Category'
import { PostForm } from '../_components/PostForm'
import type { UpdatePostRequestBody } from "@/app/api/admin/posts/[id]/route"; 
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { mutate as globalMutate } from "swr";
import { useFetch } from "@/app/_hooks/useFetch";

export default function EditPostsPage() {
  const { id } = useParams() as { id?: string };  // as { id?: string } は型推論の補助（id が一時的にundefinedの可能性もあるため）
  const { token } = useSupabaseSession()
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailImageKey, setThumbnailImageKey] = useState("https://placehold.jp/800x400.png");
  const [categories, setCategories] = useState<Partial<Category>[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false);


// ===============================
// GET
// ===============================
  const { data, error, isLoading, mutate } = useFetch<{ post: Posts }>(
    id ? `/api/admin/posts/${id}` : null
  );

  const post = data?.post;

  // 初回データ反映
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    if (!post || isInitialized) return;
      setTitle(post.title);
      setContent(post.content);
      setThumbnailImageKey(post.thumbnailImageKey);
      setCategories(post.postCategories.map((pc) => pc.category as Partial<Category>));

      setIsInitialized(true);
    }, [post, isInitialized]);

// ===============================
// PUT (update)
// ===============================
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!token) return

    try {
      //categoriesのidのみ取り出して型に合わせる
      const categoryIds = categories.map((c) => ({ id: c.id! }));
      const body: UpdatePostRequestBody = {
        title,
        content,
        thumbnailImageKey,
        categories: categoryIds, //
      };

      const res = await fetch(`/api/admin/posts/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: token,    // APIの利用制限
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("データ更新に失敗しました");

      await mutate(); // 投稿データを再フェッチ
      await globalMutate(["/api/admin/posts", token]); // 一覧キャッシュも更新

      alert("更新しました");
      router.push("/admin/posts");
    } catch (error) {
      console.error("データ更新エラー：", error);
    } finally {
      setIsSubmitting(false);
    }
  };

// ===============================
// DELETE
// ===============================
  const handleDelete = async () => {
    if (!confirm("記事を削除しますか？")) return;
    setIsSubmitting(true);
    if (!token) return

    try {
      const res = await fetch(`/api/admin/posts/${id}`, { 
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            Authorization: token, // APIの利用制限
          },
      });

      if (!res.ok) throw new Error("削除に失敗しました");

      await globalMutate(["/api/admin/posts", token]);

      alert("削除しました");
      router.push("/admin/posts");
    } catch (error) {
      console.error("データ削除エラー：", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <p>読み込み中…</p>;
  if (error) return <p>エラーが発生しました</p>;
  if (!post) return <p>データが見つかりません</p>;

  return (
    <div>
      <PostForm
        mode="edit"
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        thumbnailImageKey={thumbnailImageKey}
        setThumbnailImageKey={setThumbnailImageKey}
        categories={categories}
        setCategories={setCategories}
        onSubmit={handleUpdate}
        onDelete={handleDelete}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}