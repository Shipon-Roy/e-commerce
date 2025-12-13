"use client";
import { useEffect, useState } from "react";

export default function UserDashboard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/user/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-3xl font-bold mb-6">📦 My Orders</h1>

      {orders.length === 0 && <p>No orders found.</p>}

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="border p-4 rounded shadow-sm">
            <p className="text-sm text-gray-500">Order ID: {order._id}</p>
            <p className="font-semibold">Status: {order.status}</p>
            <p>
              <strong>Payment Method:</strong> {order.paymentMethod}
            </p>
            <p>
              <strong>Paid:</strong> {order.isPaid ? "Yes" : "No"}
            </p>
            <p>
              <strong>Address:</strong> {order.address}
            </p>
            <ul className="mt-2">
              {order.items.map((item) => (
                <li
                  key={item._id}
                  className="flex justify-between border-b py-1"
                >
                  <span>{item.product.name}</span>
                  <span>
                    ৳{item.product.price} × {item.quantity}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-2 font-bold">Total: ${order.total}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
