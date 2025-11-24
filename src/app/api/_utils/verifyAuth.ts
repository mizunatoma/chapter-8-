import { NextResponse, NextRequest } from "next/server";
import { supabase } from "@/utils/supabase";

export const verifyAuth = async (request: NextRequest) => {
  // リクエストヘッダーからtokenを取得
  const token = request.headers.get('Authorization') ?? '';
  // supabaseに対してtokenを送る
  const { error } = await supabase.auth.getUser(token);
  // 送ったtokenが正しくない場合、errorが返却されるので、クライアントにもエラーを返す
  if (error) {
    return NextResponse.json({ status: error.message }, { status: 400 });
  }
  return null;
}