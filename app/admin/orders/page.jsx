"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect, useState } from "react";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    const res = await fetch("/api/order");
    const data = await res.json();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading)
    return <p className="text-center mt-10 text-gray-400">Loading orders...</p>;

  return (
    <ProtectedRoute role="admin">
      <div className="max-w-6xl mx-auto text-white">
        <h1 className="text-3xl font-bold mb-6">📦 All Orders</h1>

        {orders.length === 0 ? (
          <p className="text-gray-400">No orders found.</p>
        ) : (
          <div className="overflow-x-auto bg-gray-900 rounded-lg shadow">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-800 text-gray-300 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Address</th>
                  <th className="px-4 py-3">Products</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b border-gray-800 hover:bg-gray-800/60 transition"
                  >
                    <td className="px-4 py-3">
                      <p className="font-semibold">{order.customer?.name}</p>
                      <p className="text-gray-400 text-xs">
                        ID: {order._id.slice(-6)}
                      </p>
                    </td>

                    <td className="px-4 py-3 text-gray-300">
                      {order.customer?.email}
                    </td>

                    <td className="px-4 py-3 text-gray-400 text-sm">
                      {order.customer?.address || "N/A"}
                    </td>

                    <td className="px-4 py-3 text-gray-300">
                      <ul className="list-disc list-inside space-y-1">
                        {order.items.map((i, idx) => (
                          <li key={idx}>
                            <p className="font-medium">{i.product.name}</p>
                            <p className="text-gray-400 text-sm">
                              Quantity: {i.quantity}
                            </p>
                            <p className="text-gray-300 text-sm">
                              Unit Price: ৳{i.product.price}
                            </p>
                            <p className="text-green-400 text-sm font-semibold">
                              Total: ৳{i.product.price * i.quantity}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </td>

                    <td className="px-4 py-3">
                      <p>
                        <span className="text-gray-300">
                          {order.paymentMethod}
                        </span>
                      </p>
                      <p className="text-xs text-gray-400">
                        Paid:{" "}
                        {order.isPaid ? (
                          <span className="text-green-400 font-semibold">
                            Yes
                          </span>
                        ) : (
                          <span className="text-red-400 font-semibold">No</span>
                        )}
                      </p>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded text-white text-xs ${
                          order.status === "Pending"
                            ? "bg-yellow-500"
                            : order.status === "Confirmed"
                            ? "bg-blue-500"
                            : "bg-green-600"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
