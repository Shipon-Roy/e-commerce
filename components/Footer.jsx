import React from "react";
import Link from "next/link";
import {
  Facebook,
  Instagram,
  Youtube,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-br from-gray-900/95 via-black/50 to-gray-900/80 backdrop-blur-xl border-t border-white/10 shadow-2xl">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 text-white">
          {/* Brand Section */}
          <div className="space-y-4 lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <span className="text-2xl font-bold">🛒</span>
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500 bg-clip-text text-transparent">
                  MyStore
                </h3>
                <p className="text-sm text-gray-400 font-medium">
                  Your trusted shopping partner
                </p>
              </div>
            </div>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-md">
              Premium quality products with fast delivery across Bangladesh.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg sm:text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span>🔗</span> Quick Links
            </h4>
            <div className="space-y-3">
              <Link
                href="/"
                className="group flex items-center gap-3 p-3 rounded-2xl bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all duration-300 hover:translate-x-2 hover:shadow-lg"
              >
                <span className="w-5 h-5 text-emerald-400 group-hover:translate-x-1 transition-transform">
                  🏠
                </span>
                <span className="text-gray-300 font-medium">Home</span>
              </Link>
              <Link
                href="/products"
                className="group flex items-center gap-3 p-3 rounded-2xl bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all duration-300 hover:translate-x-2 hover:shadow-lg"
              >
                <span className="w-5 h-5 text-emerald-400 group-hover:translate-x-1 transition-transform">
                  🛍️
                </span>
                <span className="text-gray-300 font-medium">Products</span>
              </Link>
              <Link
                href="/cart"
                className="group flex items-center gap-3 p-3 rounded-2xl bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all duration-300 hover:translate-x-2 hover:shadow-lg"
              >
                <span className="w-5 h-5 text-emerald-400 group-hover:translate-x-1 transition-transform">
                  🛒
                </span>
                <span className="text-gray-300 font-medium">Cart</span>
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg sm:text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span>📞</span> Contact Us
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:shadow-lg transition-all">
                <Phone
                  size={20}
                  className="text-emerald-400 mt-1 flex-shrink-0"
                />
                <div>
                  <p className="text-gray-300 font-medium">Phone</p>
                  <a
                    href="tel:+8801234567890"
                    className="text-sm text-white/90 hover:text-emerald-400 transition-colors font-semibold"
                  >
                    +880 1234 567890
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:shadow-lg transition-all">
                <Mail
                  size={20}
                  className="text-emerald-400 mt-1 flex-shrink-0"
                />
                <div>
                  <p className="text-gray-300 font-medium">Email</p>
                  <a
                    href="mailto:support@mystore.com"
                    className="text-sm text-white/90 hover:text-emerald-400 transition-colors font-semibold"
                  >
                    support@mystore.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Social & Newsletter */}
          <div className="lg:col-span-1">
            <h4 className="text-lg sm:text-xl font-bold text-white mb-6">
              Follow Us
            </h4>
            <div className="flex gap-3 mb-8">
              <a
                href="#"
                className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-2xl flex items-center justify-center shadow-xl hover:shadow-blue-500/30 hover:scale-110 transition-all duration-300 backdrop-blur-sm border border-blue-500/30"
              >
                <Facebook size={20} className="text-white" />
              </a>
              <a
                href="#"
                className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 rounded-2xl flex items-center justify-center shadow-xl hover:shadow-pink-500/30 hover:scale-110 transition-all duration-300 backdrop-blur-sm border border-pink-500/30"
              >
                <Instagram size={20} className="text-white" />
              </a>
              <a
                href="#"
                className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-2xl flex items-center justify-center shadow-xl hover:shadow-red-500/30 hover:scale-110 transition-all duration-300 backdrop-blur-sm border border-red-500/30"
              >
                <Youtube size={20} className="text-white" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 bg-black/30 backdrop-blur-xl py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-center text-sm text-gray-400">
          <span>
            © 2025{" "}
            <Link
              href="/"
              className="font-bold text-white hover:text-emerald-400 transition-colors"
            >
              E-commerce™
            </Link>
            . All Rights Reserved.
          </span>
          <span className="text-xs sm:text-sm">Created with ❤️ by Shipon</span>
        </div>
      </div>
    </footer>
  );
}
