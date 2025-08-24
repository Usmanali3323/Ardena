"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);

  const supabase = createClientComponentClient();
  const router = useRouter();
  const pathname = usePathname();

  // Handle mounting
  useEffect(() => setMounted(true), []);

  // Check auth state
  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
    }
    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  if (!mounted) return null;

  // ✅ Role check
  const role = user?.app_metadata?.role || "user"; // default = user

  // ✅ Active link helper
  const linkClass = (path, exact = true) => {
    const isActive = exact ? pathname === path : pathname.startsWith(path);
    return `hover:text-pink-500 transition ${
      isActive ? "text-pink-600 font-bold border-b-2 border-pink-500" : ""
    }`;
  };

  // ✅ Menu items
  const guestLinks = (
    <>
      <Link href="/" className={linkClass("/")}>
        Home
      </Link>
      <Link href="/product" className={linkClass("/product", false)}>
        Products
      </Link>
      <Link href="/about" className={linkClass("/about")}>
        About
      </Link>
    </>
  );

  const userLinks = (
    <>
      <Link href="/" className={linkClass("/")}>
        Home
      </Link>
      <Link href="/product" className={linkClass("/product", false)}>
        Products
      </Link>
      <Link href="/cart" className={linkClass("/cart")}>
        Cart
      </Link>
      <Link href="/orders" className={linkClass("/orders")}>
        Orders
      </Link>
      <Link href="/about" className={linkClass("/about")}>
        About
      </Link>
    </>
  );

  const adminLinks = (
    <>
      <Link href="/" className={linkClass("/")}>
        Home
      </Link>
      <Link href="/admin" className={linkClass("/admin")}>
        Dashboard
      </Link>
      <Link href="/about" className={linkClass("/about")}>
        About
      </Link>
    </>
  );

  const navLinks = !user
    ? guestLinks
    : role === "admin"
    ? adminLinks
    : userLinks;

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg fixed top-0 left-0 w-full z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/logo.png"
              alt="Ardena Logo"
              width={50}
              height={50}
              priority
            />
            <span className="text-2xl md:text-3xl font-extrabold tracking-wide bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 bg-clip-text text-transparent">
              Ardena
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-10 text-lg font-medium">
            {navLinks}
          </div>

          {/* Desktop Right Menu */}
          <div className="hidden md:flex items-center space-x-6 text-lg font-semibold">
            {user ? (
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-lg shadow-md hover:opacity-90 transition"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className={
                  linkClass("/login") +
                  " bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 text-white px-6 py-2 rounded-lg shadow-md hover:opacity-90 transition"
                }
              >
                Login
              </Link>
            )}

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition"
            >
              {theme === "dark" ? <Sun size={22} /> : <Moon size={22} />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-800 dark:text-gray-200 text-3xl focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? "✖" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
    {/* Mobile Menu */}
<div
  className={`md:hidden bg-white dark:bg-gray-900 overflow-hidden transition-all duration-300 ${
    isOpen ? "max-h-screen opacity-100 py-4" : "max-h-0 opacity-0"
  }`}
>
  <div className="flex flex-col space-y-4 px-6 text-lg font-medium">
    {React.Children.map(navLinks.props.children, (child) =>
      React.cloneElement(child, {
        onClick: () => setIsOpen(false), // ✅ close on link click
      })
    )}

    {user ? (
      <button
        onClick={() => {
          handleLogout();
          setIsOpen(false); // ✅ close on logout
        }}
        className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-lg shadow-md text-center hover:opacity-90 transition"
      >
        Logout
      </button>
    ) : (
      <Link
        href="/login"
        onClick={() => setIsOpen(false)} // ✅ close on login
        className={
          linkClass("/login") +
          " bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 text-white px-6 py-2 rounded-lg shadow-md text-center hover:opacity-90 transition"
        }
      >
        Login
      </Link>
    )}

    {/* Mobile Theme Toggle */}
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex items-center justify-center gap-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition"
    >
      {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
      {theme === "dark" ? "Light Mode" : "Dark Mode"}
    </button>
  </div>
</div>

    </nav>
  );
}
