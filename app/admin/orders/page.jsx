"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [updating, setUpdating] = useState(null);

  // Fetch orders
  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/order/admin/get");
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  // Update order status
  async function updateOrderStatus(orderId, newStatus) {
    setUpdating(orderId);
    try {
      const res = await fetch(`/api/order/admin/update/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId ? { ...o, status: newStatus } : o
          )
        );
      }
    } catch (error) {
      console.error("Error updating order:", error);
    } finally {
      setUpdating(null);
    }
  }

  if (loading) return <p className="p-6">Loading orders...</p>;

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-2">Orders</h1>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full border border-gray-300 bg-white  dark:bg-gray-800 dark:text-white">
            <thead className="bg-yellow-200  dark:bg-gray-900 dark:text-white">
              <tr>
                <th className="border px-4 py-2">Order ID</th>
                <th className="border px-4 py-2">User</th>
                <th className="border px-4 py-2">Address</th>
                <th className="border px-4 py-2">Total</th>
                <th className="border px-4 py-2">Payment</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Items</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="text-center hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <td className="border px-4 py-2 font-mono text-sm">
                    {order.id.slice(0, 8)}
                  </td>
                  <td className="border px-4 py-2">{order.user_id}</td>
                  <td className="border px-4 py-2 text-sm">
                    {order.shipping?.[0]?.street}, {order.shipping?.[0]?.city}
                  </td>
                  <td className="border px-4 py-2 font-bold">
                    {process.env.NEXT_PUBLIC_CURRENCY}{order.total_amount}
                  </td>
                  <td className="border px-4 py-2">{order.payment_status}</td>
                  <td className="border px-4 py-2">
                    <Select
                      onValueChange={(val) => updateOrderStatus(order.id, val)}
                      defaultValue={order.status}
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    {updating === order.id && (
                      <p className="text-xs text-gray-500">Saving...</p>
                    )}
                  </td>
                  <td className="border px-4 py-2">
                    <Button
                      size="sm"
                      className="bg-blue-500 text-white hover:bg-blue-600"
                      onClick={() =>
                        setExpandedOrder(
                          expandedOrder === order.id ? null : order.id
                        )
                      }
                    >
                      {expandedOrder === order.id ? "Hide" : "View"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Expanded Order Items */}
          {expandedOrder &&
            orders
              .filter((o) => o.id === expandedOrder)
              .map((o) => (
                <div
                  key={o.id}
                  className="border mt-4 rounded-lg bg-gray-50 p-4 shadow-inner"
                >
                  <h2 className="font-bold mb-3">Order Items</h2>
                  <div className="max-h-64 overflow-y-auto">
                    <table className="min-w-full border border-gray-200 bg-white rounded-md">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="border px-4 py-2">Image</th>
                          <th className="border px-4 py-2">Product</th>
                          <th className="border px-4 py-2">Qty</th>
                          <th className="border px-4 py-2">Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {o.order_items.map((item) => (
                          <tr
                            key={item.id}
                            className="text-center hover:bg-gray-50"
                          >
                            <td className="border px-4 py-2">
                              <img
                                src={item.product?.images?.[0]}
                                alt={item.product?.name}
                                className="w-16 h-16 object-cover rounded-md mx-auto"
                              />
                            </td>
                            <td className="border px-4 py-2">
                              {item.product?.name}
                            </td>
                            <td className="border px-4 py-2">
                              {item.quantity}
                            </td>
                            <td className="border px-4 py-2">
                              ${item.price}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
        </div>
      )}
    </div>
  );
}
