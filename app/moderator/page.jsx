"use client";
import { useEffect, useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function ModeratorDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(15);

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/order");
      const data = await res.json();
      if (!Array.isArray(data)) {
        console.error("Orders API did not return array:", data);
        setOrders([]);
      } else {
        setOrders(data);
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const totalPages = Math.ceil(orders.length / rowsPerPage);
  const paginatedOrders = orders.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const summary = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "Pending").length,
    confirmed: orders.filter((o) => o.status === "Confirmed").length,
    delivered: orders.filter((o) => o.status === "Delivered").length,
  };

  // Update order status
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/order/${orderId}`, {
        method: "PUT", // changed from PATCH to PUT
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("API Error:", text);
        throw new Error("Failed to update status");
      }

      fetchOrders(); // refresh orders after update
    } catch (err) {
      console.error(err);
      alert("Failed to update order status.");
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-400">Loading orders...</p>;

  return (
    <ProtectedRoute roles={["moderator"]}>
      <div className="text-white max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold bg-gray-700 p-4 rounded-xl shadow-2xl">
          🧑‍⚖️ Moderator Dashboard
        </h1>

        {/* Order summary */}
        <div className="grid grid-cols-5 gap-4 text-center">
          {["Total", "Pending", "Confirmed", "Delivered"].map((label, idx) => {
            const colors = [
              "bg-gray-800",
              "bg-yellow-600",
              "bg-orange-500",
              "bg-blue-600",
              "bg-green-600",
            ];
            const values = [
              summary.total,
              summary.pending,
              summary.confirmed,
              summary.delivered,
            ];
            return (
              <div key={idx} className={`${colors[idx]} p-4 rounded shadow`}>
                <p className="text-gray-300">{label} Orders</p>
                <p className="text-2xl font-bold">{values[idx]}</p>
              </div>
            );
          })}
        </div>

        {/* Orders table */}
        {paginatedOrders.length === 0 ? (
          <p className="text-gray-400">No orders found.</p>
        ) : (
          <div className="overflow-x-auto bg-gray-900 rounded-lg shadow">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-800 text-gray-300 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Address</th>
                  <th className="px-4 py-3">Products</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders
                  .filter((o) => o?._id)
                  .map((order) => (
                    <tr
                      key={order._id}
                      className="border-b border-gray-800 hover:bg-gray-800/60 transition"
                    >
                      <td className="px-4 py-3">
                        <p className="font-semibold">{order.customer?.name}</p>
                        <p className="text-gray-400 text-xs">
                          {order._id?.slice(-6) || "N/A"}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        {order.customer?.phone || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-sm">
                        <p>Address: {order.customer?.address || "N/A"}</p>
                        <p>
                          Police Station:{" "}
                          {order.customer?.policeStation || "N/A"}
                        </p>
                        <p>District: {order.customer?.district || "N/A"}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-300">
                        <ul className="list-disc list-inside space-y-1">
                          {order.items?.map((i, idx) => (
                            <li key={idx}>
                              <p className="font-medium">{i.product?.name}</p>
                              <p className="text-gray-400 text-sm">
                                Qty: {i.quantity}
                              </p>
                              <p className="text-gray-400 text-sm">
                                Size: {i.size}
                              </p>
                              <p className="text-gray-300 text-sm">
                                Unit: ৳{i.product?.price}
                              </p>
                              <p className="text-green-400 text-sm font-semibold">
                                Total: ৳{i.product?.price * i.quantity}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-gray-300">{order.paymentMethod}</p>
                        <p className="text-xs text-gray-400">
                          Paid:{" "}
                          {order.isPaid ? (
                            <span className="text-green-400 font-semibold">
                              Yes
                            </span>
                          ) : (
                            <span className="text-red-400 font-semibold">
                              No
                            </span>
                          )}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order._id, e.target.value)
                          }
                          className={`px-3 py-1 rounded text-white text-xs ${
                            order.status === "Pending"
                              ? "bg-yellow-500"
                              : order.status === "Confirmed"
                              ? "bg-blue-500"
                              : order.status === "Delivered"
                              ? "bg-green-600"
                              : "bg-gray-500"
                          }`}
                        >
                          {["Pending", "Confirmed", "Delivered"].map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-center mt-4 gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded bg-gray-700 text-white disabled:opacity-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === i + 1 ? "bg-blue-500" : "bg-gray-700"
                  } text-white`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded bg-gray-700 text-white disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
