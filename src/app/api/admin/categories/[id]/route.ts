// /src/app/api/admin/categories/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyAuth } from "@/app/api/_utils/verifyAuth";

const prisma = new PrismaClient();

// ===============================
// 詳細取得（GET）
// ===============================
export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  const { id } = params;

  const authError = await verifyAuth(request);
  if (authError) return authError;

  try { 
    const category = await prisma.category.findUnique({
      where: {
        id: parseInt(id),
      },
    })

    return NextResponse.json({ status: 'OK', category },{ status: 200 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message },{ status: 400 })
    }
  }
}

// ===============================
// 記事更新（PUT）
// ===============================
export interface UpdateCategoryRequestBody {
  name: string,
}

export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  const { id } = params;
  const body: UpdateCategoryRequestBody = await request.json();
  const { name } = body;

  const authError = await verifyAuth(request);
  if (authError) return authError;

  try {
    const category = await prisma.category.update({
      where: { id: parseInt(id) },
      data: { name },
    })

    // Date → string に変換
    const serializedCategory = {
      ...category,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
    };

  return NextResponse.json(
    { status: "OK", category: serializedCategory },
    { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 })
  }
}

// ===============================
// 記事削除（DELETE）
// ===============================
export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string} },
) => {
  const { id } = params;

  const authError = await verifyAuth(request);
  if (authError) return authError;

  try {
    const category = await prisma.category.delete({
      where: {
        id: parseInt(id),
      },
    })

    return NextResponse.json({ status: 'OK', category },{ status: 200})
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message },{ status: 400})
  }

}













