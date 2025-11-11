"use client";
import React from "react";
import { UseFormRegisterReturn } from 'react-hook-form'

type InputFieldProps = {
  label: string;
  register: UseFormRegisterReturn // react-hook-formのregisterを直接受け取る
  error?: string;
  disabled?: boolean;
  type?: string;
};

export default function InputField({
  label,
  type="text",
  register,
  error,
  disabled = false,
}: InputFieldProps) {
  return (
    <div>
      <label className="block font-medium text-gray-700">{label}</label>
      <input
        type={type}
        {...register} // react-hook-formがvalueとonChangeを紐づける
        disabled={disabled}
        className="mt-1 block w-full border border-gray-300 rounded shadow-sm p-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}