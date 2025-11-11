// /src/app/api/admin/categories/route.ts

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyAuth } from "@/app/api/_utils/verifyAuth";

const prisma = new PrismaClient();

// ===============================
// 一覧取得（GET）
// ===============================
export const GET = async (request: NextRequest) => {
  const authError = await verifyAuth(request);
  if (authError) return authError;

  try {
    const categories = await prisma.category.findMany({
      orderBy:{
        createdAt: 'desc',
      }
    })
    return NextResponse.json({ 
      status: 'OK', 
      categories, 
    },{ status: 200 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message },{ status: 400 })
    }
  }
}

// ===============================
// 新規作成（POST）
// ===============================
export interface CreateCategoryRequestBody {
  name: string,
}

export const POST = async (request: NextRequest) => {
  const authError = await verifyAuth(request);
  if (authError) return authError;

  try {
    const body: CreateCategoryRequestBody = await request.json();
    const { name } = body;
    
    const data = await prisma.category.create({
      data: { name },
    })

    return NextResponse.json({ 
      status: 'OK', 
      message: '作成しました', 
      id: data.id ,
    },{ status: 200})
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message },{ status: 400 })
  }
}