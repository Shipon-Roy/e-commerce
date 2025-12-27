"use client";
import { useEffect, useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function ModeratorDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Copy states for each button - INDIVIDUAL
  const [copiedStates, setCopiedStates] = useState({});

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

  // Open modal + lock scroll
  const openModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  // Close modal + unlock scroll
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
    document.body.style.overflow = "unset";
    // Reset all copy states
    setCopiedStates({});
  };

  // ✅ INDIVIDUAL Copy function - Only clicked button shows "Copied!"
  const copyToClipboard = async (text, buttonId) => {
    try {
      await navigator.clipboard.writeText(text);
      // Only THIS button shows copied
      setCopiedStates((prev) => ({
        ...prev,
        [buttonId]: true,
      }));

      // Reset only THIS button after 1.5s
      setTimeout(() => {
        setCopiedStates((prev) => ({
          ...prev,
          [buttonId]: false,
        }));
      }, 1500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

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
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("API Error:", text);
        throw new Error("Failed to update status");
      }

      fetchOrders();
    } catch (err) {
      console.error(err);
      alert("Failed to update order status.");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black/50 to-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-xl font-semibold text-gray-400">
            Loading orders...
          </p>
        </div>
      </div>
    );

  return (
    <>
      <ProtectedRoute roles={["moderator"]}>
        {/* Table content same as before - just button onClick changed */}
        <div className="min-h-screen bg-gradient-to-br from-gray-900/90 via-black/30 to-gray-900/70 backdrop-blur-xl text-white py-8 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 lg:space-y-12">
            {/* Header + Stats + Table same as before */}
            <div className="text-center backdrop-blur-xl bg-white/5 rounded-3xl p-8 sm:p-12 lg:p-16 border border-white/10 shadow-2xl">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500 bg-clip-text text-transparent drop-shadow-2xl mb-4">
                🧑‍⚖️ Moderator Dashboard
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Manage orders efficiently with real-time updates
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
              {[
                {
                  label: "Total Orders",
                  value: summary.total,
                  color: "from-gray-600 to-gray-700",
                  icon: "📊",
                },
                {
                  label: "Pending",
                  value: summary.pending,
                  color: "from-yellow-500 to-orange-500",
                  icon: "⏳",
                },
                {
                  label: "Confirmed",
                  value: summary.confirmed,
                  color: "from-blue-500 to-indigo-600",
                  icon: "✅",
                },
                {
                  label: "Delivered",
                  value: summary.delivered,
                  color: "from-emerald-500 to-green-600",
                  icon: "🚚",
                },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className={`group relative p-6 sm:p-8 rounded-3xl backdrop-blur-xl shadow-2xl hover:shadow-emerald-500/30 transition-all duration-500 hover:-translate-y-2 hover:scale-105 border border-white/10 bg-gradient-to-br ${stat.color} bg-opacity-20 hover:bg-opacity-30`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl blur-xl"></div>
                  <div className="relative z-10">
                    <div className="text-3xl sm:text-4xl mb-2 opacity-80">
                      {stat.icon}
                    </div>
                    <p className="text-gray-200 text-sm sm:text-base font-medium uppercase tracking-wide mb-2">
                      {stat.label}
                    </p>
                    <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-white drop-shadow-lg">
                      {stat.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Table */}
            {paginatedOrders.length === 0 ? (
              <div className="text-center py-20 backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10">
                <div className="text-6xl mb-6 opacity-20">📦</div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-400 mb-4">
                  No Orders Found
                </h2>
                <p className="text-gray-500 text-lg max-w-md mx-auto">
                  Orders will appear here when customers place them.
                </p>
              </div>
            ) : (
              <div className="backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-white/10">
                    <thead className="bg-white/10">
                      <tr>
                        <th className="px-6 py-5 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-5 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                          Products
                        </th>
                        <th className="px-6 py-5 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                          Payment
                        </th>
                        <th className="px-6 py-5 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {paginatedOrders
                        .filter((o) => o?._id)
                        .map((order) => (
                          <tr
                            key={order._id}
                            className="group hover:bg-white/10 transition-all duration-300 border-b border-white/5"
                          >
                            <td className="px-6 py-6">
                              <div>
                                <div className="font-black text-white text-xl bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent drop-shadow-lg mb-3">
                                  👤 {order.customer?.name || "N/A"}
                                </div>
                                <div className="text-gray-400 text-sm bg-gray-800/50 px-3 py-1 rounded-full inline-block mb-4">
                                  #{order._id?.slice(-6)}
                                </div>
                                <button
                                  onClick={() => openModal(order)}
                                  className="group/btn bg-gradient-to-r from-emerald-500/90 to-green-600/90 hover:from-emerald-600 hover:to-green-700 border-2 border-emerald-400/50 backdrop-blur-sm text-white font-bold px-6 py-2.5 rounded-2xl shadow-xl hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105 hover:-translate-y-1 flex items-center gap-2 w-full sm:w-auto justify-center"
                                >
                                  <span>View Details</span>
                                  <svg
                                    className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M9 5l7 7-7 7"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </td>
                            {/* Other table columns same */}
                            <td className="px-6 py-6">
                              <div className="space-y-2 max-w-md">
                                {order.items?.slice(0, 2).map((i, idx) => (
                                  <div
                                    key={idx}
                                    className="p-3 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all"
                                  >
                                    <div className="font-semibold text-white truncate">
                                      {i.product?.name}
                                    </div>
                                    <div className="text-xs text-gray-400 flex flex-wrap gap-2 mt-1">
                                      <span>Qty: {i.quantity}</span>
                                      <span>Size: {i.size || "N/A"}</span>
                                      <span className="text-green-400 font-bold">
                                        ৳
                                        {(
                                          i.product?.price * i.quantity
                                        ).toLocaleString()}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                                {order.items?.length > 2 && (
                                  <div className="text-xs text-gray-500 italic">
                                    +{order.items.length - 2} more items
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-6">
                              <div className="flex items-center justify-between text-sm bg-white/5 backdrop-blur-sm px-3 py-2 w-32 rounded-xl border border-white/10">
                                <span className="font-medium text-white truncate">
                                  {order.paymentMethod}
                                </span>
                                <span
                                  className={`px-2 py-1 rounded-lg text-xs font-medium ml-2 ${
                                    order.paymentMethod === "COD"
                                      ? "bg-orange-500/20 text-orange-400"
                                      : order.isPaid
                                      ? "bg-emerald-500/20 text-emerald-400"
                                      : "bg-red-500/20 text-red-400"
                                  }`}
                                >
                                  {order.paymentMethod === "COD"
                                    ? "No Paid"
                                    : order.isPaid
                                    ? "Paid"
                                    : "Pending"}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-6">
                              <select
                                value={order.status}
                                onChange={(e) =>
                                  handleStatusChange(order._id, e.target.value)
                                }
                                className={`px-4 py-2 bg-gray-900 rounded-2xl font-bold text-sm shadow-lg transition-all duration-300 border-2 focus:ring-4 focus:outline-none w-full ${
                                  order.status === "Pending"
                                    ? "bg-gradient-to-r from-yellow-500/90 to-orange-500/90 text-white border-yellow-400/50 hover:from-yellow-600 hover:to-orange-600 shadow-yellow-500/30"
                                    : order.status === "Confirmed"
                                    ? "bg-gradient-to-r from-blue-500/90 to-indigo-500/90 text-white border-blue-400/50 hover:from-blue-600 hover:to-indigo-600 shadow-blue-500/30"
                                    : "bg-gradient-to-r from-emerald-500/90 to-green-600/90 text-white border-emerald-400/50 hover:from-emerald-600 hover:to-green-700 shadow-emerald-500/30"
                                }`}
                              >
                                {["Pending", "Confirmed", "Delivered"].map(
                                  (s) => (
                                    <option key={s} value={s}>
                                      {s}
                                    </option>
                                  )
                                )}
                              </select>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                {/* Pagination same */}
                <div className="bg-white/5 backdrop-blur-xl border-t border-white/10 px-8 py-6">
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-bold shadow-lg hover:shadow-emerald-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ← Previous
                    </button>
                    {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                      const pageNum =
                        currentPage > 4
                          ? Math.max(totalPages - 6, 1) + i
                          : i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-4 py-3 rounded-xl font-bold shadow-lg transition-all duration-300 ${
                            currentPage === pageNum
                              ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-emerald-500/50 scale-105"
                              : "bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 hover:shadow-emerald-500/30 text-white hover:scale-105"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(p + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-bold shadow-lg hover:shadow-emerald-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next →
                    </button>
                  </div>
                  <p className="text-center text-gray-500 text-sm mt-4">
                    Page {currentPage} of {totalPages} • {orders.length} total
                    orders
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </ProtectedRoute>

      {/* ✅ FIXED MODAL - Individual Copy Buttons */}
      {isModalOpen && selectedOrder && (
        <>
          <style jsx>{`
            @keyframes modalSlideIn {
              from {
                opacity: 0;
                transform: translateY(-50px) scale(0.9);
              }
              to {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }
            .modal-overlay {
              animation: fadeIn 0.3s ease-out;
            }
            @keyframes fadeIn {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }
            @keyframes pulse {
              0%,
              100% {
                transform: scale(1);
              }
              50% {
                transform: scale(1.1);
              }
            }
            .copied {
              animation: pulse 0.3s ease-in-out;
            }
          `}</style>

          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9999] flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <div
              className="bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-3xl relative max-w-4xl mx-4 animate-modalSlideIn"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8 pb-6 border-b border-white/20">
                <h2 className="text-3xl font-black bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent flex items-center gap-3">
                  👤 Customer Details
                </h2>
                <button
                  onClick={closeModal}
                  className="w-12 h-12 bg-white/20 hover:bg-white/40 rounded-2xl flex items-center justify-center text-white text-2xl hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-emerald-500/30 ml-auto"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6 text-white">
                {/* 1️⃣ NAME */}
                <div className="text-center p-8 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-3xl border-2 border-emerald-400/50">
                  <div className="text-4xl mb-3">👤</div>
                  <div className="text-2xl font-black text-white drop-shadow-lg">
                    {selectedOrder.customer?.name || "N/A"}
                  </div>
                </div>

                {/* 2️⃣ PHONE - Individual Copy */}
                <div className="relative group p-6 bg-emerald-500/20 rounded-2xl border-2 border-emerald-400/50">
                  <div className="text-sm font-bold text-emerald-300 uppercase tracking-wide mb-3 flex items-center gap-2">
                    📱 Phone Number
                  </div>
                  <div className="text-2xl font-bold text-emerald-400 flex items-center justify-between">
                    {selectedOrder.customer?.phone || "N/A"}
                    <button
                      onClick={() =>
                        copyToClipboard(
                          selectedOrder.customer?.phone || "",
                          "phone-btn"
                        )
                      }
                      className={`w-12 h-12 bg-emerald-500/90 hover:bg-emerald-600 text-white rounded-2xl flex items-center justify-center text-xl font-bold shadow-xl transition-all hover:scale-110 ${
                        copiedStates["phone-btn"] ? "copied bg-green-500" : ""
                      }`}
                    >
                      {copiedStates["phone-btn"] ? "✅" : "📋"}
                    </button>
                  </div>
                </div>

                {/* 3️⃣ ADDRESS - Individual Copy */}
                <div className="relative group p-6 bg-white/10 rounded-2xl border border-white/20">
                  <div className="text-sm font-bold text-white/80 uppercase tracking-wide mb-3 flex items-center gap-2">
                    📍 Full Address
                  </div>
                  <div className="text-xl font-semibold leading-relaxed text-white">
                    {selectedOrder.customer?.address || "N/A"}
                  </div>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        selectedOrder.customer?.address || "",
                        "address-btn"
                      )
                    }
                    className={`absolute top-6 right-6 w-12 h-12 bg-emerald-500/80 hover:bg-emerald-600 text-white rounded-2xl flex items-center justify-center text-xl font-bold shadow-xl transition-all hover:scale-110 ${
                      copiedStates["address-btn"] ? "copied bg-green-500" : ""
                    }`}
                  >
                    {copiedStates["address-btn"] ? "✅" : "📋"}
                  </button>
                </div>

                {/* 4️⃣ THANA + 5️⃣ JELA - Individual Copy */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group p-6 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl border-2 border-yellow-400/50 text-center">
                    <div className="text-sm font-bold text-yellow-300 uppercase tracking-wide mb-4">
                      🏛️ Police Station
                    </div>
                    <div className="text-2xl font-black text-yellow-400 mb-4">
                      {selectedOrder.customer?.policeStation || "N/A"}
                    </div>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          selectedOrder.customer?.policeStation || "",
                          "thana-btn"
                        )
                      }
                      className={`w-12 h-12 mx-auto bg-yellow-500/90 hover:bg-yellow-600 text-white rounded-2xl flex items-center justify-center text-xl font-bold shadow-xl transition-all hover:scale-110 ${
                        copiedStates["thana-btn"] ? "copied bg-green-500" : ""
                      }`}
                    >
                      {copiedStates["thana-btn"] ? "✅" : "📋"}
                    </button>
                  </div>
                  <div className="group p-6 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-2xl border-2 border-blue-400/50 text-center">
                    <div className="text-sm font-bold text-blue-300 uppercase tracking-wide mb-4">
                      🗺️ District
                    </div>
                    <div className="text-2xl font-black text-blue-400 mb-4">
                      {selectedOrder.customer?.district || "N/A"}
                    </div>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          selectedOrder.customer?.district || "",
                          "jela-btn"
                        )
                      }
                      className={`w-12 h-12 mx-auto bg-blue-500/90 hover:bg-blue-600 text-white rounded-2xl flex items-center justify-center text-xl font-bold shadow-xl transition-all hover:scale-110 ${
                        copiedStates["jela-btn"] ? "copied bg-green-500" : ""
                      }`}
                    >
                      {copiedStates["jela-btn"] ? "✅" : "📋"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
