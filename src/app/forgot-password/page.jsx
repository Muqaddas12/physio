"use client";
import { sendResetLink } from "@/lib/actions/authActions";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [status, setStatus] = useState(null);

  async function handleSubmit(formData) {
    const res = await sendResetLink(formData);
    setStatus(res.message);
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full p-6 bg-white rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
        <form action={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            required
            className="w-full border rounded p-2 mb-4"
          />
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded w-full"
          >
            Send Reset Link
          </button>
        </form>
        {status && <p className="mt-4 text-sm text-gray-600">{status}</p>}
      </div>
    </div>
  );
}
