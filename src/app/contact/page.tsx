"use client";
import { useForm } from 'react-hook-form';
import InputField from "@/app/_components/InputField";

type FormValues = {
  name: string
  email: string
  message: string
}

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>()

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await fetch(
        "https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/contacts",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data), // react-hook-formが{ name, email, message }をすでにまとめてくれている。
        }                             // 分割して使用する場合はconstで設定する。ここでは丸ごと利用するため不要。
      )

      if(res.ok) {
        alert("送信しました");
        reset();
      } else {
        alert("送信に失敗しました");
      }  
    } catch(err) {
      console.error(err);
      alert("エラーが発生しました");
    } 
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} 
      className="max-w-lg mx-auto space-y-6 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2x1 font-bold text-center mb-4">お問い合わせフォーム</h2>

      <InputField
        label="お名前"
        register={register('name', {
          required: '名前は必須です',
          maxLength: { value: 30, message: '30文字以内で入力してください' },
        })}
        error={errors.name?.message}
      />
      
      <InputField
        label="メールアドレス"
        register={register('email', {
          required: 'メールアドレスは必須です',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: '正しいメールアドレスを入力してください',
          },
        })}
        error={errors.email?.message}
      />

      <div>
        <label className="block font-medium text-gray-700">本文</label>
        <textarea
          disabled={isSubmitting}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-md shadow-sm p-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
          rows={5}
          {...register('message', {required: '本文は必須です'})}
        />
        {errors.message && (<p className="text-red-500 text-sm mt-1">{errors.message.message}</p>)}
      </div>

      <div className="flex justify-center gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-6 py-2 rounded-md shadow hover:bg-blue-700 disabled:bg-gray-400">
          {isSubmitting ? "送信中..." : "送信"}
        </button>

        <button
          type='button'
          onClick={() => reset()}
          disabled={isSubmitting}
          className="bg-gray-300 text-black px-6 py-2 rounded-md shadow hover:bg-gray-400 disabled:bg-gray-200"
        >
          クリア
        </button>
      </div>
    </form>
  );
}
