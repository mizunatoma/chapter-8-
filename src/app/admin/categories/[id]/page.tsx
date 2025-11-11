"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CategoryForm } from '../_components/CategoryForm'
import type { UpdateCategoryRequestBody } from "@/app/api/admin/categories/[id]/route";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import useSWR, { mutate as globalMutate } from "swr";

export default function EditCategoriesPage() {
  const { id } = useParams() as { id?: string };
  const { token } = useSupabaseSession()
  const router = useRouter();

  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

// ===============================
// GET
// ===============================
  const { data: category, error, isLoading, mutate } = useSWR(
    token && id ? [`/api/admin/categories/${id}`, token] : null,
    async ([url, tkn]) => {
      const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: tkn,
      },
    });
    if (!res.ok) throw new Error("カテゴリ取得に失敗しました");
    const { category } = await res.json();
    return category as { id: number; name: string };
    }
  );

  // 初回データ反映（フォーム用）
  if (category && name === "") setName(category.name);

// ===============================
// PUT (update)
// ===============================
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!token) return

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