"use client";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import { Menu, X, ShoppingCart, User, LogOut, ShoppingBag } from "lucide-react";

export default function Navbar() {
  const { cart } = useCart();
  const { user, logout, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (loading) return null;

  return (
    <nav className="backdrop-blur-xl bg-white/10 bg-gradient-to-r from-gray-900/80 via-gray-800/60 to-gray-900/80 border-b border-white/10 sticky top-0 z-50 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 sm:py-5">
          {/* 🚀 Premium Logo */}
          <Link
            href="/"
            className="group flex items-center gap-3 text-2xl sm:text-3xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg hover:scale-105 transition-all duration-300"
          >
            <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400 group-hover:rotate-12 transition-all duration-500" />
            MyStore
          </Link>

          {/* 🎯 Mobile Menu Button */}
          <button
            className="md:hidden p-2.5 rounded-2xl backdrop-blur-sm bg-white/10 hover:bg-white/20 border border-white/20 shadow-xl hover:shadow-white/30 transition-all duration-300 hover:scale-110 active:scale-95"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* 💻 Desktop Menu */}
          <div className="hidden md:flex items-center gap-2 sm:gap-3 lg:gap-4">
            {/* 🛒 Premium Cart */}
            <Link
              href="/cart"
              className="group relative p-2.5 sm:p-3 rounded-2xl backdrop-blur-sm bg-white/10 hover:bg-white/20 border border-white/20 shadow-xl hover:shadow-blue-500/20 transition-all duration-400 hover:scale-110"
            >
              <ShoppingCart
                size={20}
                className="group-hover:text-blue-400 transition-colors"
              />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs w-6 h-6 rounded-2xl flex items-center justify-center font-bold shadow-2xl animate-bounce border-2 border-white/30">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Link>

            {/* 👤 User Menu */}
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-2 backdrop-blur-sm bg-white/10 rounded-2xl border border-white/20 text-sm font-semibold text-white/90">
                  <User size={18} />
                  <span className="hidden sm:inline">
                    Hi, {user?.role || "User"}
                  </span>
                </div>

                {user?.role === "admin" && (
                  <Link
                    href="/admin"
                    className="px-4 py-2.5 backdrop-blur-sm bg-gradient-to-r from-orange-500/20 to-red-500/20 hover:from-orange-500/30 hover:to-red-500/30 border border-orange-400/30 rounded-2xl font-semibold text-orange-100 shadow-xl hover:shadow-orange-500/20 transition-all duration-300 hover:scale-105"
                  >
                    Admin
                  </Link>
                )}

                {user?.role === "moderator" && (
                  <Link
                    href="/moderator"
                    className="px-4 py-2.5 backdrop-blur-sm bg-gradient-to-r from-purple-500/20 to-indigo-500/20 hover:from-purple-500/30 hover:to-indigo-500/30 border border-purple-400/30 rounded-2xl font-semibold text-purple-100 shadow-xl hover:shadow-purple-500/20 transition-all duration-300 hover:scale-105"
                  >
                    Moderator
                  </Link>
                )}

                <button
                  onClick={logout}
                  className="p-2.5 rounded-2xl backdrop-blur-sm bg-gradient-to-r from-red-500/20 to-rose-500/20 hover:from-red-500/30 hover:to-rose-500/30 border border-red-400/30 shadow-xl hover:shadow-red-500/20 transition-all duration-300 hover:scale-105"
                >
                  <LogOut
                    size={20}
                    className="text-red-200 hover:text-red-100"
                  />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-6 sm:px-8 py-2.5 backdrop-blur-sm bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 border border-emerald-400/30 rounded-2xl font-semibold text-emerald-100 shadow-xl hover:shadow-emerald-500/20 transition-all duration-300 hover:scale-105"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* 📱 Premium Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden backdrop-blur-xl bg-gradient-to-b from-gray-900/95 to-gray-800/80 border-t border-white/10 animate-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            {/* 🛒 Mobile Cart */}
            <Link
              href="/cart"
              className="group flex items-center gap-3 p-4 backdrop-blur-sm bg-white/5 hover:bg-white/10 rounded-2xl border border-white/20 shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:translate-x-2"
              onClick={() => setMenuOpen(false)}
            >
              <ShoppingCart
                size={20}
                className="group-hover:text-blue-400 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="font-semibold text-white block">Cart</span>
                {totalItems > 0 && (
                  <span className="inline-flex items-center gap-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg mt-1">
                    {totalItems} items
                  </span>
                )}
              </div>
            </Link>

            {/* 👤 Mobile User Menu */}
            {user ? (
              <>
                <div className="p-4 backdrop-blur-sm bg-white/5 rounded-2xl border border-white/20 text-center">
                  <User size={24} className="mx-auto mb-2 text-blue-400" />
                  <span className="font-semibold text-white text-lg block mb-1">
                    Hi, {user?.role || "User"}
                  </span>
                </div>

                {user?.role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 p-4 backdrop-blur-sm bg-linear-to-r from-orange-500/20 to-red-500/20 hover:from-orange-500/30 hover:to-red-500/30 border border-orange-400/30 rounded-2xl font-semibold text-orange-100 shadow-xl hover:shadow-orange-500/20 transition-all duration-300"
                  >
                    <span className="w-5 h-5">⚙️</span>
                    Admin Dashboard
                  </Link>
                )}

                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-3 p-4 backdrop-blur-sm bg-gradient-to-r from-red-500/20 to-rose-500/20 hover:from-red-500/30 hover:to-rose-500/30 border border-red-400/30 rounded-2xl font-semibold text-red-100 shadow-xl hover:shadow-red-500/20 transition-all duration-300"
                >
                  <LogOut size={20} />
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 p-4 backdrop-blur-sm bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 border border-emerald-400/30 rounded-2xl font-semibold text-emerald-100 shadow-xl hover:shadow-emerald-500/20 transition-all duration-300 justify-center"
              >
                <span className="w-5 h-5">🔐</span>
                Login / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
