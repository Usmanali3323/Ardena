"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    monthlySales: 0,
    newUsers: 0,
  });
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);

        // Fetch products count
        const productsRes = await fetch("/api/admin/products/count");
        const productsData = await productsRes.json();

        // Fetch monthly sales
        const salesRes = await fetch("/api/admin/sales");
        const salesData = await salesRes.json();

        // Fetch new users
        const usersRes = await fetch("/api/admin/users");
        const usersData = await usersRes.json();

        setStats({
          totalProducts: productsData.count,
          monthlySales: salesData.totalSales,
          newUsers: usersData.count,
        });

        setSalesData(salesData.monthly || []);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) return <p className="p-6 text-gray-600">Loading dashboard...</p>;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="p-4 shadow-lg rounded-2xl">
          <CardContent>
            <p className="text-gray-500">Total Products</p>
            <h2 className="text-xl font-bold">{stats.totalProducts}</h2>
          </CardContent>
        </Card>
        <Card className="p-4 shadow-lg rounded-2xl">
          <CardContent>
            <p className="text-gray-500">Monthly Sales</p>
            <h2 className="text-xl font-bold">{process.env.NEXT_PUBLIC_CURRENCY}{stats.monthlySales}</h2>
          </CardContent>
        </Card>
        <Card className="p-4 shadow-lg rounded-2xl">
          <CardContent>
            <p className="text-gray-500">New Users</p>
            <h2 className="text-xl font-bold">{stats.newUsers}</h2>
          </CardContent>
        </Card>
      </div>

      {/* Sales Chart */}
      <Card className="p-6 shadow-lg rounded-2xl">
        <h2 className="text-lg font-semibold mb-4">Sales of the Month</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salesData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="sales" fill="#facc15" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
