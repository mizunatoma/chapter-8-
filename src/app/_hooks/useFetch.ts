"use client";

import useSWR from "swr";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

export function useFetch<T>(endpoint: string | null) {
  const { token } = useSupabaseSession();

  const fetcher = async (url: string): Promise<T> => {

    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: token } : {}), // tokenがあるときだけAuthorizationを付与
      },
    });

    if (!res.ok) throw new Error("データ取得に失敗しました");
    return (await res.json()) as T;
  };


  const { data, error, isLoading, mutate } = useSWR<T>(
    endpoint, // nullなら何もしない
    endpoint ? fetcher : null // 実行or停止
  );

  return { data, error, isLoading, mutate };
}
