"use client";
import React, { useState, useEffect, ChangeEvent } from 'react';
import { Category } from "@/app/_types";
import { CategoriesSelect } from './CategoriesSelect'; 
import { supabase } from '@/utils/supabase';
import { v4 as uuidv4 } from 'uuid';  // 固有IDを生成するライブラリ
import Image from "next/image";

interface Props {
  mode: 'new' | 'edit'
  title: string
  setTitle: (title: string) => void
  content: string
  setContent: (content: string) => void
  thumbnailImageKey: string
  setThumbnailImageKey: (url: string) => void
  categories: Partial<Category>[]
  setCategories: (categories: Partial<Category>[]) => void
  onSubmit: (e: React.FormEvent) => void
  onDelete?: () => void
  isSubmitting?: boolean;
}

export const PostForm: React.FC<Props> = ({
  mode,
  title,
  setTitle,
  content,
  setContent,
  thumbnailImageKey,
  setThumbnailImageKey,
  categories,
  setCategories,
  onSubmit,
  onDelete,
  isSubmitting = false,
}) => {

const [thumbnailImageUrl, setThumbnailImageUrl] = useState<string | null>(null);


// ■ 2. 画像アップロード機能の実装
const handleImageChange = async (
  event: ChangeEvent<HTMLInputElement>,
): Promise<void> => {
  if (!event.target.files || event.target.files.length === 0) {
    return // 画像が選択されていないのでreturn
  }

  const file = event.target.files[0] //選択された画像を取得
  const filepath = `private/${uuidv4()}` // ファイルパスを指定

  // supabaseに画像をアップロード
  const { data, error } = await supabase.storage
    .from('post_thumbnail') // ここでバケットを指定
    .upload(filepath, file, {
      cacheControl: '3600',
      upsert: false,
    })

  // アップロードに失敗したらエラーを表示して終了
  if (error) {
    alert(error.message)
    return
  }

  // data.pathに、画像固有のkeyが入っているので、tumbnailImageKeyに格納する
  setThumbnailImageKey(data.path)
}

// ■ 3. アップロードした画像を表示する実装
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

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">
        {mode === 'edit' ? '記事編集' : '記事作成'}
      </h1>

      <form className="block space-y-4 mb-1 text-sm" onSubmit={onSubmit}>
        <div>
          <label className="block">タイトル</label>
          <input
            type="text"
            className="border rounded w-full p-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block">内容</label>
          <textarea
            rows={6}
            className="border rounded w-full p-2"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label 
            htmlFor="thumbnailImageKey"
            className="block text-sm font-medium text-gray-700"
          >サムネイルURL</label>
          <input
            type="file"
            id="thumbnailImageKey"
            onChange={handleImageChange}
            accept="image/*"
            disabled={isSubmitting}
          />
        </div>

        {thumbnailImageUrl && (
          <div>
            <Image
              src={thumbnailImageUrl}
              alt="thumbnail"
              width={400}
              height={400}
            />
          </div>
        )}

        <div>
          <label
            htmlFor="thumbnailUrl"
            className="block text-sm font-medium text-gray-700"
          >
            カテゴリー
          </label>
          <CategoriesSelect
            selectedCategories={categories}
            setSelectedCategories={setCategories}
            isSubmitting={isSubmitting}
          />
        </div>

        <div className="flex gap-4 mt-4">
          <button
            type="submit"
            className="border rounded text-white bg-blue-600 px-4 py-2 hover:bg-blue-700 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {mode === 'edit' ? '更新' : '投稿'}
          </button>

          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="border rounded text-white bg-red-600 px-4 py-2 hover:bg-red-700 disabled:opacity-50"
              disabled={isSubmitting}
            >
              削除
            </button>
          )}
        </div>
      </form>
    </div>
  );
};