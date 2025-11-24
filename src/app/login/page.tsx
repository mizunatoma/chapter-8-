'use client'

import { supabase } from '@/utils/supabase'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

type FormValues = {
  email: string
  password: string
}

export default function Page() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValues>()

  const onSubmit = async (data: FormValues) => {
    const { email, password } = data

    // 一致するユーザーが存在すれば、トークンとユーザーデータを返す
    const { error } = await supabase.auth.signInWithPassword({ 
      email,
      password,
    })

    if (error) {
      alert('ログインに失敗しました')
    } else {
      router.replace('/admin/posts')
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
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="name@company.com"
            {...register('email', {
              required: 'メールアドレスは必須です',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: '正しいメールアドレスを入力してください',
              },
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
            disabled={isSubmitting}
            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            ログイン
          </button>
        </div>
      </form>
    </div>
  )
}