"use client";
import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Fetch dashboard stats
  const fetchStats = async () => {
    const res = await fetch("/api/admin/stats");
    const data = await res.json();
    setStats(data);
  };

  // Fetch all users
  const fetchUsers = async () => {
    setLoadingUsers(true);
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    setUsers(data);
    setLoadingUsers(false);
  };

  useEffect(() => {
    fetchStats();
    fetchUsers();
  }, []);

  if (!stats) return <p className="text-white">Loading...</p>;

  return (
    <ProtectedRoute role="admin">
      <div className="space-y-6 text-white">
        <h1 className="text-3xl font-bold">📊 Admin Dashboard</h1>

        <div className="grid sm:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-6 rounded shadow">
            <h2 className="font-semibold">Total Products</h2>
            <p className="text-2xl">{stats.totalProducts}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded shadow">
            <h2 className="font-semibold">Total Orders</h2>
            <p className="text-2xl">{stats.totalOrders}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded shadow">
            <h2 className="font-semibold">Active Users</h2>
            <p className="text-2xl">{stats.totalUsers}</p>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-gray-900 p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-3">Recent Orders</h2>
          <ul className="space-y-3">
            {stats.recentOrders.map((order) => (
              <li key={order._id} className="border p-3 rounded">
                <p>
                  <strong>Order ID:</strong> {order._id}
                </p>
                <p>
                  <strong>User:</strong> {order.customer?.name} (
                  {order.customer?.email})
                </p>
                <p>
                  <strong>Address: </strong>
                  {order.customer?.address}
                </p>
                <p>
                  <strong>Status:</strong> {order.status}
                </p>
                <ul className="ml-4 list-disc">
                  {order.items?.map((item, i) => (
                    <li key={i}>
                      {item.product?.name || item.product} × {item.quantity} ($
                      {item.product?.price || "N/A"} each) —{" "}
                      <strong className="text-green-400">
                        Total: $
                        {item.product?.price
                          ? item.product.price * item.quantity
                          : "N/A"}
                      </strong>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </ProtectedRoute>
  );
}
