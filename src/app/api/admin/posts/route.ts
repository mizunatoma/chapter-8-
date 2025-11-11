// /src/app/api/admin/posts/route.ts

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyAuth } from "@/app/api/_utils/verifyAuth";

const prisma = new PrismaClient()

// ===============================
// 一覧取得（GET）
// ===============================
export const GET = async (request: NextRequest) => {
  const authError = await verifyAuth(request);
  if (authError) return authError;

  try {
    const posts = await prisma.post.findMany({
      include: {
        postCategories: {
          include: { 
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      }
    })
    return NextResponse.json({ status: 'OK', posts: posts }, { status: 200 })

  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 })
  }
}

// ===============================
// 新規作成（POST）
// ===============================

// 記事作成のリクエストボディの型
export interface CreatePostRequestBody {
  title: string
  content: string
  categories: { id: number }[] // カテゴリーIDをいくつか持った配列を送る
  thumbnailImageKey: string
}

export const POST = async (request: NextRequest ) => {
  const authError = await verifyAuth(request);
  if (authError) return authError;

  try {
    // フロントから送られてきたbodyを分解し、
    // 各変数に代入しながら、型をCreatePostRequestBodyとして保証している
    const body: CreatePostRequestBody = await request.json();
    const { title, content, categories, thumbnailImageKey } = body;
    
    // 投稿をDBに生成
    const data = await prisma.post.create({
      data: { title, content, thumbnailImageKey },
    })

    // 中間テーブルに記事に紐づく複数カテゴリを登録
    // sqliteではcreateManyが使えないので、for文1つずつ実施
    for (const category of categories) {
      await prisma.postCategory.create({
        data: {
          categoryId: category.id,
          postId: data.id,
        },
      })
    }

    return NextResponse.json({ status: 'OK', message: '作成しました', id: data.id}, { status: 200})

  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400})
    }
  }
}

