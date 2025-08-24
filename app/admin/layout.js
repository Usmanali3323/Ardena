"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddProduct from "@/components/product/add";

export default function AdminLayout({ children }) {
  const pathname = usePathname(); // current route

  const links = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/products", label: "Products" },
    { href: "/admin/categories", label: "Categories" },
    { href: "/admin/orders", label: "Orders" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 fixed top-0 left-0 h-screen bg-white dark:bg-gray-800 shadow-lg p-6 flex flex-col">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-8">
          Admin Panel
        </h2>

        <nav className="flex-1 space-y-4 overflow-y-auto">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-4 py-2 rounded ${
                pathname === link.href
                  ? "bg-yellow-200 dark:bg-yellow-900 text-yellow-600 font-semibold"
                  : "hover:bg-yellow-100 dark:hover:bg-yellow-900 hover:text-yellow-500"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Add Product Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <button className="w-full text-left px-4 py-2 rounded hover:bg-yellow-100 dark:hover:bg-yellow-900 hover:text-yellow-500">
                Add Product
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">
                  Add New Product
                </DialogTitle>
              </DialogHeader>
              <AddProduct onSuccess={() => alert("Product added successfully!")} />
            </DialogContent>
          </Dialog>
        </nav>

        <div className="mt-auto text-sm text-gray-400 dark:text-gray-500">
          &copy; {new Date().getFullYear()} Admin Panel
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 mt-10 mb-5 flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
