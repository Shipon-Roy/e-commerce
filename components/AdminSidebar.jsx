"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LogOut,
  Package,
  ShoppingCart,
  LayoutDashboard,
  Users,
} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/admin", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { href: "/admin/products", label: "Products", icon: <Package size={18} /> },
    {
      href: "/admin/orders",
      label: "Orders",
      icon: <ShoppingCart size={18} />,
    },
    { href: "/admin/users", label: "Users", icon: <Users size={18} /> }, // ✅ Users link added
  ];

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 text-gray-200 p-5 flex flex-col justify-between h-screen">
      <div>
        <h2 className="text-2xl font-bold mb-8 text-white">⚙️ Admin Panel</h2>
        <nav className="space-y-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 px-3 py-2 rounded transition ${
                pathname === link.href
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-800"
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <button className="flex items-center gap-2 px-3 py-2 rounded bg-red-600 hover:bg-red-700 text-white">
        <LogOut size={18} /> Logout
      </button>
    </aside>
  );
}
