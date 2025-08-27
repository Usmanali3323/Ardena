"use client";

import Link from "next/link";
import ProductBox from "../productBox";
import { useEffect, useState } from "react";

export default function RecentlyAdded() {
  const [products, setProducts] = useState([]);
  const [loading,setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products/get");
        if (!res.ok) {
          console.error("Fetch error, status:", res.status);
          return;
        }
        const data = await res.json();
        setLoading(false)

        // ✅ handle both cases (products array OR single product)
    setProducts(data.products)
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    }

    fetchProducts();
  }, []);

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-black py-20 transition-colors duration-500">
      <div className="container mx-auto px-4 sm:px-6 md:px-12">
        {/* Section Title */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100">
            Recently{" "}
            <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 bg-clip-text text-transparent">
              Added
            </span>
          </h2>
          <Link
            href="/product"
            className="text-pink-500 hover:text-pink-600 font-semibold transition"
          >
            See All &rarr;
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid gap-10">
          
                 {loading ? (
          <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-white dark:bg-gray-900 rounded-xl shadow-md h-80"
              />
            ))}
          </div>
        ) : (
         <ProductBox products={products.slice(0,3)}/>
        )}
      
        </div>
      </div>
    </section>
  );
}
