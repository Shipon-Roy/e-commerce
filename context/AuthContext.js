"use client";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ LocalStorage থেকে user লোড করা — শুধুমাত্র client side এ
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          if (["user", "moderator", "admin"].includes(parsed.role)) {
            setUser(parsed);
          }
        } catch (err) {
          console.error("Invalid user data:", err);
        }
      }
      setLoading(false);
    }
  }, []);

  // ✅ Login
  const login = (userData) => {
    const validUser = {
      name: userData.name,
      role: userData.role,
      email: userData.email,
    };
    setUser(validUser);
    localStorage.setItem("user", JSON.stringify(validUser));
  };

  // ✅ Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
