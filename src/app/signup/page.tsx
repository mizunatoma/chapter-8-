'use client'

import { supabase } from '@/utils/supabase' // supabaseのインスタンス
import { useForm } from 'react-hook-form'

// 入力フォームの型定義
type FormValues = {
  email: string
  password: string
}

export default function Page() {

  // useFormフックの初期設定
  const {
    register,     // 各inputに紐づけ
    handleSubmit, // onSubmitの代わり
    reset,        // フォーム初期化用
    formState: { isSubmitting },
  } = useForm<FormValues>()


  const onSubmit = async (data: FormValues) => {
    const { email, password } = data

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
          emailRedirectTo: `http://localhost:3000/login`, // 送信するとメールアドレスの検証メールが送られ、そのメール内に載せる登録完了ページ用のURLを指定
      },
    })
  
  if (error) {
    alert('登録に失敗しました')
  } else {
    reset() // 入力欄をクリア
    alert('確認メールを送信しました。')
  }
}

  return (
    <div className="flex justify-center pt-[120px]">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-[400px]">
        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            メールアドレス
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="name@company.com"
            // react-hook-formのregister関数でフィールドを登録
            // register('email', { ...ルール... })
            // 第二引数でバリデーションルールを設定
            {...register('email', {
              required: 'メールアドレスは必須です',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: '正しいメールアドレスを入力してください',
              }
            })}
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            パスワード
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="••••••••"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            {...register('password', {
              required: 'パスワードは必須です',
              minLength: {
                value: 6,
                message: '6文字以上で入力してください',
              },
            })}
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitting} // 送信中はボタンを無効化
            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            {isSubmitting ? '送信中' : '登録'}
          </button>
        </div>
      </form>
    </div>
  )
}