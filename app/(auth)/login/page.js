"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const supabase = createClientComponentClient(); // client-side Supabase

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    if (data?.session) {
      // session stored in localStorage automatically
      toast.success("successfully Signin")
      window.location.href = "/";
    } else {
      setErrorMsg("Login failed: No session returned.");
    }
  };

  return (
    <section className="mt-6 py-12 flex min-h-screen items-center justify-center bg-gradient-to-br from-yellow-100 via-white to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-black px-4">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 shadow-xl p-8 sm:p-10">
        <div className="flex flex-col items-center mb-6">
          <h1 className="mt-4 text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
            Welcome Back
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 text-center">
            Log in to continue your Heer Chain journey.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={form.password}
              onChange={handleChange}
              placeholder="********"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 text-white py-3 rounded-lg font-semibold shadow-md hover:opacity-90 transition duration-200 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {errorMsg && (
          <p className="text-red-500 mt-4 text-center text-sm">{errorMsg}</p>
        )}

        <div className="mt-6 text-center space-y-2">
          <a
            href="/forgot-password"
            className="block text-sm bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 bg-clip-text text-transparent font-semibold hover:opacity-80 transition"
          >
            Forgot your password?
          </a>

          <a
            href="/signup"
            className="block text-sm text-gray-600 dark:text-gray-400 hover:underline"
          >
            Don’t have an account? <span className="font-semibold">Sign up</span>
          </a>
        </div>
      </div>
    </section>
  );
}
