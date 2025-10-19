"use client";
import { motion } from "framer-motion";

export default function AdminCard({ title, value, icon }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-gray-800 rounded-xl p-5 shadow-lg flex items-center justify-between"
    >
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <h3 className="text-2xl font-bold text-white">{value}</h3>
      </div>
      <div className="text-blue-500">{icon}</div>
    </motion.div>
  );
}
