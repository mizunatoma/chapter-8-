"use client";

import useSWR from "swr";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

export function useFetch<T>(endpoint: string | null) {
  const { token } = useSupabaseSession();

  const fetcher = async (url: string): Promise<T> => {
    if (!token) {throw new Error("認証トークンがありません")}

    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    if (!res.ok) throw new Error("データ取得に失敗しました");
    return (await res.json()) as T;
  };

  const { data, error, isLoading, mutate } = useSWR<T>(
    token && endpoint ? endpoint : null,
    fetcher
  );

  return { data, error, isLoading, mutate };
}
