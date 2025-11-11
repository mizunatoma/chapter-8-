import { supabase } from '@/utils/supabase'
import { Session } from '@supabase/supabase-js'
import { useState, useEffect } from 'react'

export const useSupabaseSession = () => {
  // undefind: ログイン状態ロード中, null: ログインしていない, Session: ログインしている
  const [session, setSession] = useState<Session | null | undefined>(undefined)
  const [token, setToken] = useState<string | null>(null)
  const [isLoding, setIsLoding] = useState(true)

  useEffect(() => {
    const fetcher = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession() // 現在ログイン中かどうかのチェック
      setSession(session)
      setToken(session?.access_token || null)
      setIsLoding(false)
    }

    fetcher()
  }, [])

  return { session, isLoding, token }
  // sessionオブジェクトの中にある、tokenは、JWT（JsonWebToken）と呼ばれるもので、
  // ログインユーザーの情報を暗号化して文字列に変換したもの
}