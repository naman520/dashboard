"use client";
import axios from "axios";
import React, { useState, useEffect } from "react";
import SignUp from "./SignUp";
import UserEditModal from "./UserEditModal";

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  team_id: number;
  team_name?: string;
}

interface Team {
  id: number;
  name: string;
}

export default function Userstable() {
  const [data, setData] = useState<User[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSignup, setShowSignup] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const fetchTeams = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/teams",
        { withCredentials: true }
      );
      if (response.data.success) {
        setTeams(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const openSign = () => {
    setShowSignup(true);
  }

  const closeSign = () => {
    setShowSignup(false);
  }

  const handleShow = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        //"http://localhost:5000/api/auth/getAllUsers",
        "https://dash-backend-l5cs.onrender.com/api/auth/getAllUsers",
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (Array.isArray(response.data)) {
        setData(response.data);
      } else if (response.data && typeof response.data === 'object') {
        const possibleArrays = [
          response.data.users,
          response.data.data,
          response.data.result,
          response.data.userList
        ];
        
        let foundArray = false;
        for (const arr of possibleArrays) {
          if (Array.isArray(arr)) {
            setData(arr);
            foundArray = true;
            break;
          }
        }
        
        if (!foundArray) {
          setError("Unexpected data structure from API");
        }
      } else {
        setError("Invalid data format received from API");
      }
      
    } catch (error) {
      console.error("Error fetching users:", error);
      if (axios.isAxiosError(error)) {
        setError(`API Error: ${error.response?.status} - ${error.response?.statusText || error.message}`);
      } else {
        setError("Network error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleShow();
    fetchTeams();
  }, []);

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(
         // `http://localhost:5000/api/users/${userId}`,
          `https://dash-backend-vxau.onrender.com/api/users/${userId}`,
          { withCredentials: true }
        );
        handleShow();
      } catch (error) {
        console.error("Error deleting user:", error);
        setError("Failed to delete user");
      }
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
  };

  const handleCloseEditModal = () => {
    setEditingUser(null);
  };

  const handleUserUpdated = () => {
    handleShow();
    setEditingUser(null);
  };

  const handleRefresh = () => {
    handleShow();
  };

  return (
    <>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">User Management</h2>
          <div className="space-x-2">
            <button
              onClick={openSign}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              Add New User
            </button>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Team
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.length > 0 ? (
                data.map((user, index) => (
                  <tr key={user.id || index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.id || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.username || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.email || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {user.role || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {user.team_name || teams.find(t => t.id === user.team_id)?.name || `Team ${user.team_id}` || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    {loading ? "Loading..." : error ? error : "No users found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showSignup && (
        <SignUp 
          onClose={closeSign} 
          onUserAdded={handleRefresh}
          teams={teams}
        />
      )}

      {editingUser && (
        <UserEditModal
          user={editingUser}
          onClose={handleCloseEditModal}
          onUserUpdated={handleUserUpdated}
          teams={teams}
        />
      )}
    </>
  );
}