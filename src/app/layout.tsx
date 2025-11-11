"use client";
import Link from "next/link";
import "./globals.css";
import { supabase } from "@/utils/supabase";
import { useState, useEffect } from "react";
import type { User } from "@supabase/supabase-js"; // anyを避ける

export default function RootLayout({ 
  children,
}: { 
  children: React.ReactNode;
}) {

  // ===============================
  // ログイン状況の管理・切替
  // ===============================
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data }= await supabase.auth.getUser(); // Supabaseから「現在のユーザー情報」を取得
      setUser(data.user); // data.user にログイン中のユーザー情報が入る（いなければnull）
    }
    getUser();

    // onAuthStateChangeは「認証状態が変化したとき」に呼ばれるイベントリスナー
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe(); // クリーンアップ
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();  // Supabaseのセッションを削除（ログアウト）
    location.href = "/";
  };

  return (
    <html lang="ja">
      <body className="bg-gary-50  text-gray-800">
        <header className="p-4 border-b border-gray-700 bg-black text-white">
          <nav className="flex items-center justify-between max-w-5xl mx-auto">
            <Link href="/" className="font-bold text-lg text-white-800 hover:opacity-80">Blog</Link>
            
            <div className="flex gap-4">
              <Link href="/contact" className="text-white-800 hover:underline">お問い合わせ</Link>
              {user 
                ? (<button onClick={handleLogout} className="text-white-800 hover:underline">ログアウト</button>)
                : (<Link href="/login" className="text-white-800 hover:underline">ログイン</Link>)
              }
            </div>
          </nav>
        </header>

        <main>{children}</main>
      </body>
    </html>
  )
}



