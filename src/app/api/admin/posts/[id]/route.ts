// /src/app/api/admin/posts/[id]/route.ts

import { NextRequest,NextResponse } from "next/server";
import { PrismaClient  } from "@prisma/client";
import { verifyAuth } from "@/app/api/_utils/verifyAuth";

const prisma = new PrismaClient()

// ===============================
// 詳細取得（GET）
// ===============================
export const GET = async( 
  request: NextRequest, 
  { params } : { params: { id :string }},
) => {
  // params から id を取り出す
  const { id } = params

  const authError = await verifyAuth(request);
  if (authError) return authError;

  try {
    const post = await prisma.post.findUnique({
      where: { id: parseInt(id) },
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
    })
    return NextResponse.json({ status: 'OK', post: post }, { status: 200 })

  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message  }, { status: 400 })
  }
}

// ===============================
// 記事更新（PUT）
// ===============================
export interface UpdatePostRequestBody {
  title: string
  content: string
  categories: { id: number }[] // カテゴリーIDをいくつか持った配列を送る
  thumbnailImageKey: string
}

export const PUT = async (
  request: NextRequest,
  { params } : { params: { id: string } },
) => {
  // params から id を取り出す
  const { id } = params
  // リクエストのbodyを取得
  const body: UpdatePostRequestBody = await request.json();
  const { title, content, categories, thumbnailImageKey } = body;
  
  const authError = await verifyAuth(request);
  if (authError) return authError;

  try {
    const post = await prisma.post.update({
      where: { id: parseInt(id) },
      data: {
        title,
        content,
        thumbnailImageKey,
      },
    })

    // 一旦、中間テーブルのレコードを全て削除
    await prisma.postCategory.deleteMany({
      where: { postId: parseInt(id) }
    })
    
    // 中間テーブルに記事に紐づく複数カテゴリを登録
    // sqliteではcreateManyが使えないので、for文1つずつ実施
    for (const category of categories) {
      await prisma.postCategory.create({
        data: {
          categoryId: category.id,
          postId: post.id,
        },
      })
    }

    // Date → string に変換
    const serializedPost = {
      ...post,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    };

    // レスポンス
    return NextResponse.json({ status: 'OK', post: serializedPost }, { status: 200})
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400})
    }
  }
}

// ===============================
// 記事削除（DELETE）
// ===============================
export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  // params から id を取り出す
  const { id } = params

  const authError = await verifyAuth(request);
  if (authError) return authError;

  try {
    // ブログ記事テーブルのidを指定して削除
    await prisma.post.delete({
      where: { id: parseInt(id) },
    })

    // レスポンス
    return NextResponse.json({ status: 'OK' }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 })
  }
}






















