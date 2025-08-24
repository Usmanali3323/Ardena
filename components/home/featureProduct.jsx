"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import AddToCart from "../product/addToCart";
import { Button } from "../ui/button";
import ProductBox from "../productBox";

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const res = await fetch("/api/products/top");
        const data = await res.json();
        setProducts(data || []);
      } catch (error) {
        console.error("Error fetching top products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, []);

  return (
    <section className="bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-gray-950 py-20 transition-colors duration-500">
      <div className="container mx-auto px-6 md:px-12">
        {/* Section Title */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100">
            Featured{" "}
            <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 bg-clip-text text-transparent">
              Products
            </span>
          </h2>
          <Link
            href="/product"
            className="text-pink-500 hover:text-pink-600 font-semibold transition"
          >
            See All →
          </Link>
        </div>

        {/* Loading Skeletons */}
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
         <ProductBox products={products}/>
        )}
      </div>
    </section>
  );
}
