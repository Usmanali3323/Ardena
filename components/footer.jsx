"use client";

import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative z-10 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-6 md:px-12 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Brand */}
        <div className="space-y-4 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <Image src="/logo.png" alt="Heer Chain" width={40} height={40} className="rounded" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 bg-clip-text text-transparent">
              Ardena
            </h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
           Where comfort meets timeless fashion.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-pink-500 transition">Home</Link></li>
            <li><Link href="/product" className="hover:text-pink-500 transition">Products</Link></li>
            <li><Link href="/about" className="hover:text-pink-500 transition">About</Link></li>
            <li><Link href="/cart" className="hover:text-pink-500 transition">Cart</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Support</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/orders" className="hover:text-pink-500 transition">Orders</Link></li>
            <li><Link href="/policy" className="hover:text-pink-500 transition">Returns</Link></li>
            <li><Link href="/faq" className="hover:text-pink-500 transition">FAQ</Link></li>
            <li><Link href="https://portflio-4ac1d.web.app/" className="hover:text-pink-500 transition">Developer</Link></li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            {[
              { icon: <Facebook size={18} />, href: "https://www.facebook.com/usman.ali.797869" },
              { icon: <Instagram size={18} />, href: "https://www.instagram.com/usman106525/" },
              { icon: <Linkedin size={18} />, href: "https://www.linkedin.com/in/usman-ali-8aa5a223b " },
            ].map((social, idx) => (
              <Link
                key={idx}
                href={social.href}
                className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-pink-500 hover:text-white transition"
              >
                {social.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 dark:border-gray-800 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
        &copy; {new Date().getFullYear()} Ardena. All rights reserved.
      </div>
    </footer>
  );
}
