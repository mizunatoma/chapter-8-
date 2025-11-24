"use client";
import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; //現在のURLパスを取得できるフック
import { useRouteGuard } from '@/app/_hooks/useRouteGuard';

export default function AdminLayout({ children }: { children: ReactNode }) {
  useRouteGuard()

  const pathname = usePathname()
  const isSelected = (href: string) => {
    return pathname.includes(href)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        {/* サイドバー */}
        <aside className="w-60 bg-gray-100 border-r">
          <nav className="flex flex-col p-4 space-y-2">
            <Link 
              href="/admin/posts"
              className={`p-2 rounded ${
                isSelected('/admin/categories') && 'bg-blue-100',
                pathname === "/admin/posts"
                ? "bg-blue-100 text-blue-600 font-bold"
                : "hover:bg-gray-200"
              }`}
            >
              記事一覧
            </Link>
            <Link
              href="/admin/categories"
              className={`p-2 rounded ${
                isSelected('/admin/categories') && 'bg-blue-100',
                pathname === "/admin/categories"
                  ? "bg-blue-100 text-blue-600 font-bold"
                  : "hover:bg-gray-200"
              }`}
            >
              カテゴリー一覧
            </Link>
          </nav>
        </aside>

        {/* メイン */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
