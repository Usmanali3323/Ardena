"use client";

import { useEffect, useState } from "react";
import ProductBox from "@/components/productBox";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [loading, setLoading] = useState(true);

  // ✅ Fetch Categories
  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // ✅ Fetch Products depending on category & sort
  const fetchProducts = async () => {
    try {
      setLoading(true);

      let url = "/api/products/get";

      if (selectedCategory === "all") {
        // no category → check sort
        if (sortBy === "latest") url = "/api/products/get";
        else if (sortBy === "popular") url = "/api/products/top";
      } else {
        // category selected → pass category + sort
        url = `/api/products/category/${selectedCategory}?sort=${sortBy}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();

      setProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Initial load
  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  // ✅ Refetch whenever category OR sort changes
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, sortBy]);

  return (
    <section className="bg-white dark:bg-black py-20 transition-colors duration-500">
      <div className="container mx-auto px-6 md:px-12">
        {/* Page Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-8">
          Our Products
        </h1>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1 rounded-full text-sm font-medium border ${
                selectedCategory === "all"
                  ? "bg-pink-500 text-white border-pink-500"
                  : "text-gray-600 dark:text-gray-300 hover:border-gray-400"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-full text-sm font-medium border whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? "bg-pink-500 text-white border-pink-500"
                    : "text-gray-600 dark:text-gray-300 hover:border-gray-400"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm dark:bg-black dark:text-gray-200"
          >
            <option value="latest">Latest</option>
            <option value="popular">Popular</option>
          </select>
        </div>

        {/* Product Grid */}
        {loading ? (
          <p className="text-gray-500">Loading products...</p>
        ) : products.length > 0 ? (
          <div className="grid gap-10">
              <ProductBox products={products} />
          </div>
        ) : (
          <p className="text-gray-500">No products found.</p>
        )}
      </div>
    </section>
  );
}
