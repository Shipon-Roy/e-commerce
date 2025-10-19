"use client";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-950">
      {/* Sidebar 25% */}
      <div className="w-1/4">
        <AdminSidebar />
      </div>

      {/* Main content 75% */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
