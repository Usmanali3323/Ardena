"use client";

import Link from "next/link";
import { redirect } from "next/navigation";
import { useState } from "react";
export default function AddToCart({ product, selectedSize, quantity, selectedColor }) {
  const [cartLoading, setCartLoading] = useState(false);

  const handleAddToCart = async () => {
    if (!quantity) return redirect(`/product/${product.id}`);
    setCartLoading(true);

    try {
      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          price: product.price * (1 - (product.discount_percent || 0) / 100),
          size: selectedSize,
          color: selectedColor,
          quantity,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add to cart");

      alert("✅ Item added to cart!");
    } catch (err) {
      console.error("Add to cart error:", err);
      alert("❌ Failed to add item to cart");
    } finally {
      setCartLoading(false);
    }
  };
  

  return (
    <div className="flex flex-col sm:flex-row gap-2 max-w-md">
      {/* Color Preview (if available) */}
      {selectedColor && (
        <div className="flex items-center gap-2 mb-2 sm:mb-0">
          <span className="text-sm font-medium">Color:</span>
          <div
            className="w-6 h-6 rounded-full border shadow"
            style={{ backgroundColor: selectedColor }}
          ></div>
        </div>
      )}

      <button
        onClick={handleAddToCart}
        disabled={cartLoading}
        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition disabled:opacity-50"
      >
        {cartLoading ? "Adding..." : `Add ${quantity ? quantity : ""} to Cart`}
      </button>
    </div>
  );
}
