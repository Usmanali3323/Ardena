"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import CartSummary from "@/components/cart/cart";
import Loading from "@/loading";

export default function CheckoutPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [cart, setCart] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);

  const [total, setTotal] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");

  const [address, setAddress] = useState({
    phone: "",
    street: "",
    city: "",
    postcode: "",
    country: "",
  });

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  useEffect(() => {
    async function fetchUser() {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data?.user) {
        router.push("/login");
        return;
      }

      setUser(data.user);
      setLoadingUser(false);
    }

    fetchUser();
  }, [router]);

  useEffect(() => {
    async function fetchCart() {
      const res = await fetch("/api/cart/get");
      const data = await res.json();

      if (data?.cart) {
        setCart(data.cart);
        const t = data.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        setTotal(t);
      }
      setLoadingCart(false);
    }
    fetchCart();
  }, []);

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handlePayClick = async () => {
    for (let key in address) {
      if (!address[key]) return alert("Please fill all address fields");
    }
    if (!cardNumber || !expiry || !cvc) return alert("Please fill all payment details");

    setShowPopup(true);
    setPaymentStatus("");

    setTimeout(async () => {
      const res = await fetch("/api/order/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          cart,
          total,
          address,
          payement_status:"paid",
          user: {
            name: user.user_metadata?.full_name || user.email,
            email: user.email,
          },
        }),
      });
      const data = await res.json();

      if (data.error) {
        setPaymentStatus("failed");
        return;
      }

      await fetch("/api/cart/clear", { method: "POST", credentials: "include" });
      setPaymentStatus("success");

      setTimeout(() => router.push(`/orders`), 2000);
    }, 2000);
  };

  if (loadingUser || loadingCart) {
    return <Loading/>;
  }

  return (
    <div suppressHydrationWarning={true} className="py-12 mt-5 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-gray-900 dark:text-gray-100">
        Checkout
      </h1>

      {user && (
        <div className="mb-8 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg text-center transition-colors duration-300">
          <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {user.user_metadata?.full_name || user.email}
          </p>
          <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Address & Payment */}
        <div className="space-y-6">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-colors duration-300 space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Shipping Address</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {["phone", "postcode", "street", "city", "country"].map((field) => (
                <input
                  key={field}
                  type="text"
                  name={field}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={address[field]}
                  onChange={handleAddressChange}
                  className={`${
                    field === "street" ? "sm:col-span-2" : ""
                  } w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:outline-none text-gray-900 dark:text-gray-100`}
                />
              ))}
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-colors duration-300 space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Payment Details</h2>
            <input
              type="text"
              placeholder="Card Number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:outline-none text-gray-900 dark:text-gray-100"
            />
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:outline-none text-gray-900 dark:text-gray-100"
              />
              <input
                type="text"
                placeholder="CVC"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:outline-none text-gray-900 dark:text-gray-100"
              />
            </div>
            <button
              onClick={handlePayClick}
              className="w-full py-3 bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 text-white font-semibold rounded-lg shadow-lg hover:opacity-90 transition"
            >
              Pay {process.env.NEXT_PUBLIC_CURRENCY} {total}
            </button>
          </div>
        </div>

        {/* Cart Summary */}
        <CartSummary cart={cart} total={total} />
      </div>

      {/* Payment Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl w-80 text-center transition-colors duration-300">
            {paymentStatus === "" && <p className="text-lg font-medium text-gray-900 dark:text-gray-100">Processing Payment...</p>}
            {paymentStatus === "success" && <p className="text-green-600 font-bold text-xl">Payment Successful!</p>}
            {paymentStatus === "failed" && <p className="text-red-600 font-bold text-xl">Payment Failed!</p>}
          </div>
        </div>
      )}
    </div>
  );
}
