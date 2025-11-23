"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { CategoryForm } from '../_components/CategoryForm'
import type { UpdateCategoryRequestBody } from "@/app/api/admin/categories/[id]/route";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { mutate as globalMutate } from "swr";
import { useFetch } from "@/app/_hooks/useFetch";
import type { Category } from "@/app/_types";

export default function EditCategoriesPage() {
  const { id } = useParams() as { id?: string };
  const { token } = useSupabaseSession()
  const router = useRouter();

  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

// ===============================
// GET
// ===============================
  const { data, error, isLoading, mutate } = useFetch<{ category: Category }>(
    id ? `/api/admin/categories/${id}` : null
  );
  
  const category = data?.category;

  // 初回データ反映（フォーム用）
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!category || isInitialized) return;
    setName(category.name)
    setIsInitialized(true);
  }, [category, isInitialized]);

// ===============================
// PUT (update)
// ===============================
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return
    setIsSubmitting(true);

    try {
      const body: UpdateCategoryRequestBody = { name };
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" ,
        Authorization: token, // APIの利用制限
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("更新に失敗しました");

      await mutate(); // カテゴリキャッシュ更新
      await globalMutate(["/api/admin/categories", token]); // 一覧キャッシュも更新

      alert("更新しました");
      router.push("/admin/categories")
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
    if (!confirm("カテゴリーを削除しますか？")) return;
    setIsSubmitting(true);
    if (!token) return

    try {
      const res = await fetch(`/api/admin/categories/${id}`, { 
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          Authorization: token, // APIの利用制限
        },
      });

      if (!res.ok) throw new Error("削除に失敗しました");

      await globalMutate(["/api/admin/categories", token]);

      alert("削除しました");
      router.push("/admin/categories");
    } catch (error) {
        console.error("カテゴリー削除エラー：", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <p>読み込み中…</p>;
  if (error) return <p>エラーが発生しました</p>;
  if (!category) return <p>カテゴリーが見つかりません</p>;

  return (
    <div>
      <CategoryForm
        mode="edit"
        name={name}
        setName={setName}
        onSubmit={handleUpdate}
        onDelete={handleDelete}
        isSubmitting={isSubmitting}
      />   
    </div>
  );
}