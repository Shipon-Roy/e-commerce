"use client";
import { useEffect, useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";

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

  // ✅ FIXED: Total Revenue from DELIVERED orders ONLY (using DB fields + fallback)
  const totalRevenue = stats.recentOrders
    .filter((order) => order.status === "Delivered")
    .reduce((sum, order) => {
      // Method 1: Use DB totalPrice (with shipping)
      const dbTotal = Number(order.totalPrice || 0);

      // Method 2: Fallback - calculate from items + shipping
      const itemsTotal = order.items.reduce((acc, item) => {
        return (
          acc + Number(item.product?.price || 0) * Number(item.quantity || 0)
        );
      }, 0);

      const shipping = Number(order.shippingCost || 0);
      const fallbackTotal = itemsTotal + shipping;

      // Use DB total if available, else fallback
      return sum + (dbTotal > 0 ? dbTotal : fallbackTotal);
    }, 0);

  return (
    <ProtectedRoute roles={["admin"]}>
      <div className="space-y-6 text-white">
        <h1 className="text-3xl font-bold">📊 Admin Dashboard</h1>

        <div className="grid sm:grid-cols-4 gap-6">
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
          <div className="bg-green-800/50 border-2 border-green-500/30 p-6 rounded shadow">
            <h2 className="font-semibold text-green-300">Total Revenue</h2>
            <p className="text-3xl font-bold text-green-400">
              ৳ {totalRevenue.toLocaleString()}
            </p>
            <p className="text-sm text-green-300 mt-1">
              {
                stats.recentOrders.filter((o) => o.status === "Delivered")
                  .length
              }{" "}
              Delivered Orders
            </p>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-gray-900 p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-3">Recent Orders</h2>
          <ul className="space-y-3">
            {stats.recentOrders.map((order) => {
              // Calculate order total same way as revenue
              const orderTotal =
                Number(order.totalPrice || 0) ||
                order.items.reduce((acc, item) => {
                  return (
                    acc +
                    Number(item.product?.price || 0) *
                      Number(item.quantity || 0)
                  );
                }, 0) + Number(order.shippingCost || 0);

              return (
                <li
                  key={order._id}
                  className={`p-4 rounded-lg border-2 ${
                    order.status === "Delivered"
                      ? "border-green-500/30 bg-green-500/5"
                      : "border-gray-700"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold">
                        #{order._id.slice(-6)} - {order.customer?.name}
                      </p>
                      <p className="text-sm text-gray-400">
                        {order.customer?.phone || order.customer?.email}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-sm font-semibold px-3 py-1 rounded-full ${
                          order.status === "Delivered"
                            ? "bg-green-500/20 text-green-400"
                            : order.status === "Pending"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : order.status === "Confirmed"
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {order.status}
                      </p>
                      <p className="font-bold text-green-400 text-lg">
                        ৳{orderTotal.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p>
                        <strong>Address:</strong> {order.customer?.address}
                      </p>
                      <p>
                        <strong>PS:</strong> {order.customer?.policeStation}
                      </p>
                      <p>
                        <strong>District:</strong> {order.customer?.district}
                      </p>
                    </div>

                    <div>
                      <p>
                        <strong>Payment:</strong> {order.paymentMethod || "COD"}
                      </p>
                      {order.shippingCost && (
                        <p>
                          <strong>Shipping:</strong> ৳
                          {Number(order.shippingCost).toLocaleString()}
                        </p>
                      )}
                      <p
                        className={`font-semibold ${
                          order.isPaid ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        Paid: {order.isPaid ? "✅ Yes" : "❌ No"}
                      </p>
                    </div>
                  </div>

                  <ul className="ml-4 list-disc mt-3 space-y-1">
                    {order.items?.map((item, i) => (
                      <li key={i} className="text-sm">
                        <span className="font-medium">
                          {item.product?.name || item.product}
                        </span>
                        <span className="text-gray-400">
                          {" "}
                          × {item.quantity}
                        </span>
                        <span className="text-green-400 ml-2">
                          ৳
                          {(
                            Number(item.product?.price || 0) * item.quantity
                          ).toLocaleString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </ProtectedRoute>
  );
}
