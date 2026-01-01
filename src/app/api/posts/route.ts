// /src/app/api/posts/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export const GET = async ( request: NextRequest) => {
  try {
    // Postを取ってくるときに、中間テーブル（PostCategory）と、その先のCategory情報もまとめて持ってくる
    const posts = await prisma.post.findMany({
      include: {  // リレーションを一緒に取得。JOIN 的なイメージ。
        postCategories: {
          include: {
            category: {
              select: {  // SELECT id, name FROM ... のselect
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // バックエンドのコンソール画面でログ出力・確認
    console.log(posts)

    return NextResponse.json({ status: 'OK', posts: posts }, { status: 200 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 })
    }
  }
}









