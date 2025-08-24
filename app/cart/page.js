"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Loading from "@/loading";
import useUser from "@/components/session";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const {user,load} = useUser()

  useEffect(() => {
    async function fetchCart() {
      setLoading(true);
      try {
        const res = await fetch("/api/cart/get");
        const data = await res.json();
        setCartItems(data.cart || []);
      } catch (err) {
        console.error("Error fetching cart:", err);
      }
      setLoading(false);
    }

    fetchCart();
  }, []);

  const updateQuantity = async (id, newQty) => {
    if (newQty < 1) return;
    try {
      const res = await fetch("/api/cart/update/quantity", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, quantity: newQty }),
      });
      const data = await res.json();
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity: data.quantity } : item
        )
      );
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  const removeItem = async (id) => {
    try {
      await fetch(`/api/cart/remove`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );



  if (loading || load)
    return <Loading/>;

  if (cartItems.length === 0)
    return (
      <div className="p-6 mt-20 mb-10 text-center text-gray-500">
        <p>Your cart is empty.</p>
        <Link href="/" className="text-blue-500 underline">
          Continue Shopping
        </Link>
      </div>
    );

  return (
    <div className="py-10 mt-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-semibold mb-6">Shopping Cart</h1>

      <div className="space-y-6">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row items-center gap-4 border-b pb-4"
          >
            {/* Product Image */}
            <div className="w-24 h-24 sm:w-32 sm:h-32 relative flex-shrink-0">
              <Image
                src={item.product_id.images?.[0] || "/fallback.jpg"}
                alt={item.product_id.name}
                fill={true}
                className="object-contain rounded"
              />
            </div>

            {/* Product Details */}
            <div className="flex-1 w-full">
              <h2 className="text-base sm:text-lg font-medium">{item.product_id.name.length > 35 ? item.product_id.name.slice(0,70)+"..." : item.product_id.name}</h2>
              {item.size && (
                <p className="text-sm text-gray-500 mt-1">
                  Size: {item.size.toUpperCase()}
                </p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                Color:{" "}
                <span
                  className="inline-block w-4 h-4 rounded-full border"
                  style={{ backgroundColor: item.color }}
                ></span>
              </p>
              <p className="text-red-600 font-bold mt-1">
                PKR {item.price.toLocaleString()}
              </p>

              {/* Quantity Controls */}
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 flex items-center justify-center border rounded text-sm font-bold hover:bg-gray-100"
                >
                  -
                </button>
                <span className="text-sm px-2">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center border rounded text-sm font-bold hover:bg-gray-100"
                >
                  +
                </button>
                <button
                  onClick={() => removeItem(item.id)}
                  className="ml-4 text-red-500 text-sm hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Total & Checkout */}
      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-lg sm:text-xl font-semibold">
          Total: PKR {totalAmount.toLocaleString()}
        </p>
        <Link
          href="/checkout"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 w-full sm:w-auto text-center"
        >
          Checkout
        </Link>
      </div>
    </div>
  );
}
