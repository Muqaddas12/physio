"use client";
import { resetPassword } from "@/lib/actions/authActions";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
export const dynamic = "force-dynamic";
export default function ResetPasswordPage() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");
  const email = params.get("email");

  const [status, setStatus] = useState(null);

  async function handleSubmit(formData) {
    formData.append("token", token);
    formData.append("email", email);
    const res = await resetPassword(formData);
    setStatus(res.message);

    if (res.success) {
      setTimeout(() => {
        router.push("/login"); 
      }, 1500);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full p-6 bg-white rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
        <form action={handleSubmit}>
          <input
            type="password"
            name="password"
            placeholder="Enter new password"
            className="w-full border rounded p-2 mb-4"
            required
          />
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded w-full"
          >
            Reset Password
          </button>
        </form>
        {status && <p className="mt-4 text-sm text-gray-600">{status}</p>}
      </div>
    </div>
  );
}
