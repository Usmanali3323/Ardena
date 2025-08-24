"use client";

import { useState } from "react";
import { useTheme } from "next-themes";

export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const { theme, setTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setErrorMsg(data.error || "Signup failed");
      } else {
        setSuccessMsg("✅ Signup successful! Check your email to confirm.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-18 min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-100 via-white to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-black px-6 transition-colors">
      <div className="max-w-6xl w-full flex flex-col md:flex-row items-center bg-white dark:bg-gray-900 shadow-2xl rounded-3xl overflow-hidden">
        {/* Left Side */}
        <div className="hidden md:flex md:w-1/2 bg-[url('/hero-fashion.jpg')] bg-cover bg-center relative">
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white text-center px-6 leading-snug">
              Welcome to <span className="text-yellow-400">MyWearShop</span>
            </h2>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-1/2 p-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-4 text-gray-900 dark:text-white">
            Create Account
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-10 text-lg">
            Join us & shop the latest fashion trends
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-yellow-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-yellow-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="********"
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-yellow-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black dark:bg-yellow-400 text-white dark:text-black py-3 rounded-xl font-semibold text-lg hover:opacity-90 transition-all disabled:opacity-50"
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>

          {errorMsg && <p className="text-red-500 text-center mt-4">{errorMsg}</p>}
          {successMsg && <p className="text-green-500 text-center mt-4">{successMsg}</p>}

          <p className="text-base text-center mt-8 text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <a href="/login" className="text-black dark:text-yellow-400 font-semibold hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
