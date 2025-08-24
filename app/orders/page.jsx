"use client";
import useUser from "@/components/session";
import Loading from "@/loading";
import { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const { user, load } = useUser();

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/order/user-orders");
        if (!res.ok) throw new Error("Failed to fetch orders");

        const data = await res.json();
        setOrders(data.orders || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  if (loading) return <Loading />;
  if (orders.length === 0)
    return <p className="text-center py-10">No orders found.</p>;

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };


  if(load){
    return <Loading/>
  }

  
  if (orders.length === 0)
    return (
      <div className="p-6 mt-20 mb-10 text-center text-gray-500">
        <p>Your cart is empty.</p>
        <Link href="/" className="text-blue-500 underline">
          Continue Shopping
        </Link>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border p-6 rounded-xl shadow-lg bg-white hover:shadow-xl transition"
          >
            {/* Header */}
            <div
              className="flex justify-between items-center mb-3 cursor-pointer"
              onClick={() => toggleExpand(order.id)}
            >
              <span className="font-semibold text-lg">Order #{order.id}</span>
              <span className="text-sm text-gray-500">
                {new Date(order.created_at).toLocaleString()}
              </span>
            </div>

            {/* Status + Payment */}
            <div className="flex flex-wrap gap-3 mb-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  order.status
                )}`}
              >
                {order.status}
              </span>
              <span className="text-sm text-gray-700">
                Payment:{" "}
                <b className="capitalize">
                  {order.payment_method || "N/A"}
                </b>
              </span>
            </div>

            {/* Collapsible content */}
            {expandedOrder === order.id && (
              <div className="mt-4">
                {/* Address */}
                {order.shipping?.length > 0 && (
                  <div className="mb-4 text-sm text-gray-700">
                    <p className="font-medium mb-1">Shipping to:</p>
                    <p>
                      {order.shipping[0].street}, {order.shipping[0].city},{" "}
                      {order.shipping[0].country} -{" "}
                      {order.shipping[0].postcode}
                    </p>
                    <p>📞 {order.shipping[0].phone}</p>
                  </div>
                )}

                {/* Items */}
                <div className="border-t pt-3 space-y-3">
                  {order.order_items?.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between border-b pb-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product?.images?.[0]}
                          alt={item.product?.name}
                          className="w-16 h-16 rounded-lg object-cover border"
                        />
                        <div>
                          <p className="font-medium text-sm">
                            {item.product?.name}
                          </p>
                          {item.product?.color && (
                            <p className="text-xs text-gray-500">
                              Color:{" "}
                              <span
                                className="inline-block w-4 h-4 rounded-full border ml-1 align-middle"
                                style={{
                                  backgroundColor: item.product.color,
                                }}
                              ></span>{" "}
                              {item.product.color}
                            </p>
                          )}
                          <p className="text-xs text-gray-500">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="font-semibold text-gray-800">
                        {process.env.NEXT_PUBLIC_CURRENCY}{item.price}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer: Total + ETA */}
                <div className="border-t mt-4 pt-3 flex justify-between text-sm">
                  <span>
  ETA:{" "}
  <b>
    { order.status === "processing"
      ? addDays(5) // today + 5
      : order.status === "shipped"
      ? addDays(3) // today + 3
      : order.status === "cancel"
      ? "Cancel"
      : order.status === "delivered"
      ? "Delivered"
      : order.status === "pending"
      ? "pending"
      : "Not available"}
  </b>
</span>

                  <span className="font-bold text-lg text-gray-800">
                    Total: {process.env.NEXT_PUBLIC_CURRENCY +" "}{order.total_amount || "0.00"}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
