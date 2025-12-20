"use client";
import { useEffect, useState } from "react";
import ProtectedRoute from "../../../components/ProtectedRoute";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    setUsers(data);
    setLoadingUsers(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateRole = async (id, newRole) => {
    await fetch(`/api/admin/users/${id}/role`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    fetchUsers();
  };

  return (
    <ProtectedRoute role="admin">
      <div className="max-w-6xl mx-auto text-white">
        <h1 className="text-3xl font-bold mb-6">👥 User Management</h1>
        <div className="bg-gray-900 p-6 rounded shadow">
          {loadingUsers ? (
            <p className="text-gray-400">Loading users...</p>
          ) : (
            <table className="min-w-full text-left text-sm border border-gray-700 rounded overflow-hidden">
              <thead className="bg-gray-800 text-gray-300 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center py-6 text-gray-400 italic"
                    >
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr
                      key={user._id}
                      className="border-b border-gray-700 hover:bg-gray-700/50 transition"
                    >
                      <td className="px-4 py-3">{user.name}</td>
                      <td className="px-4 py-3">{user.email}</td>
                      <td className="px-4 py-3">{user.role}</td>
                      <td className="px-4 py-3 text-right space-x-2">
                        {/* Promote to Moderator */}
                        {user.role === "user" && (
                          <button
                            onClick={() => updateRole(user._id, "moderator")}
                            className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700"
                          >
                            Make Moderator
                          </button>
                        )}

                        {/* Moderator → Admin */}
                        {user.role === "moderator" && (
                          <>
                            <button
                              onClick={() => updateRole(user._id, "admin")}
                              className="px-3 py-1 rounded bg-green-600 hover:bg-green-700"
                            >
                              Promote to Admin
                            </button>
                            <button
                              onClick={() => updateRole(user._id, "user")}
                              className="px-3 py-1 rounded bg-red-600 hover:bg-red-700"
                            >
                              Remove Moderator
                            </button>
                          </>
                        )}

                        {/* Admin → User */}
                        {user.role === "admin" && (
                          <button
                            onClick={() => updateRole(user._id, "user")}
                            className="px-3 py-1 rounded bg-red-600 hover:bg-red-700"
                          >
                            Remove Admin
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
