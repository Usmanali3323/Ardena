"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:3000/update-password", // 👈 must match Supabase Auth settings
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("✅ Password reset email sent. Check your inbox!");
    }

    setLoading(false);
  };

  return (
    <section className="mt-6 flex min-h-screen items-center justify-center bg-gradient-to-br from-yellow-100 via-white to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-black px-4">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 shadow-xl p-8 sm:p-10">
        {/* Logo + Title */}
        <div className="flex flex-col items-center mb-6">
  
          <h1 className="mt-4 text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
            Forgot Password
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 text-center">
            Enter your email and we’ll send you a reset link.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleReset} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 text-white py-3 rounded-lg font-semibold shadow-md hover:opacity-90 transition duration-200 disabled:opacity-70"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {/* Message */}
        {message && (
          <p
            className={`mt-4 text-center text-sm ${
              message.startsWith("✅")
                ? "text-green-600 dark:text-green-400"
                : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        {/* Back to login */}
        <div className="mt-6 text-center">
          <a
            href="/login"
            className="text-sm bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 bg-clip-text text-transparent font-semibold hover:opacity-80 transition"
          >
            ← Back to Login
          </a>
        </div>
      </div>
    </section>
  );
}
