"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CategoryForm } from '../_components/CategoryForm';
import type { CreateCategoryRequestBody } from '@/app/api/admin/categories/route';
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { mutate as globalMutate } from "swr";

export default function NewCategoryPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token } = useSupabaseSession()

// ===============================
// POST (create)
// ===============================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!token) return;

    try {
      const body: CreateCategoryRequestBody = { name };

      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers:  {
          'Content-Type': 'application/json',
          Authorization: token, // APIの利用制限
          },
        body: JSON.stringify(body),
      });

      const { id } = await res.json();
      
      await globalMutate(["/api/admin/categories", token]);

      router.push(`/admin/categories/${id}`);
      alert("カテゴリーを作成しました");
    } catch (error) {
      console.error("データ作成エラー：", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <CategoryForm
        mode="new"
        name={name}
        setName={setName}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />   
    </div>
  );
}