"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const data = await res.json();
      login({
        name: data.name,
        email: data.email,
        role: data.role,
      });

      if (data.role === "admin") {
        router.push("/admin");
      } else if (data.role === "moderator") {
        router.push("/moderator");
      } else {
        router.push("/");
      }
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 px-4 sm:px-6 lg:px-8">
      <form
        onSubmit={handleLogin}
        className="bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-sm sm:max-w-md md:max-w-lg border border-gray-700"
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-white">
          Login
        </h1>

        <div className="mb-4">
          <label className="block text-gray-300 text-sm mb-1">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-300 text-sm mb-1">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300"
        >
          Login
        </button>

        <p className="text-center text-gray-400 text-sm mt-4">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-400 hover:text-blue-300">
            Register
          </a>
        </p>
      </form>
    </div>
  );
}
