"use client";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [status, setStatus] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const email = e.target.email.value;

    const res = await fetch("/api/auth/send-reset-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setStatus(data.message);
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full p-6 bg-white rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
        <form onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="Enter your email" required className="w-full border rounded p-2 mb-4"/>
          <button type="submit" className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded w-full">Send Reset Link</button>
        </form>
        {status && <p className="mt-4 text-sm text-gray-600">{status}</p>}
      </div>
    </div>
  );
}
