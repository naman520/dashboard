"use client";
import axios from "axios";
import React, { useState, useEffect } from "react";
import SignUp from "./SignUp";

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

export default function Userstable() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSignup, setShowSignup] = useState(false);

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
        "https://dash-backend-vxau.onrender.com/api/auth/getAllUsers",
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Full API response:", response);
      console.log("Response data:", response.data);
      console.log("Data type:", typeof response.data);
      console.log("Is array:", Array.isArray(response.data));
      
      // Check if response.data is an array
      if (Array.isArray(response.data)) {
        setData(response.data);
        console.log("Data set successfully:", response.data);
      } 
    
      else if (response.data && typeof response.data === 'object') {
        const possibleArrays = [
          response.data.users,
          response.data.data,
          response.data.result,
          response.data.userList
        ];
        
        let foundArray = false;
        for (const arr of possibleArrays) {
          if (Array.isArray(arr)) {
            console.log("Found users array in:", arr);
            setData(arr);
            foundArray = true;
            break;
          }
        }
        
        if (!foundArray) {
          console.log("Response data structure:", Object.keys(response.data));
          setError("Unexpected data structure from API");
        }
      } else {
        console.error("Response data is not an array or object:", response.data);
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

  // Call handleShow when component mounts
  useEffect(() => {
    handleShow();
  }, []);

  const handleAddUser = () => {
    console.log("Add new user clicked");
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(
          
          //"http://localhost:5000/api/users/${userId}",
          "https://dash-backend-vxau.onrender.com/api/users/${userId}",
          {
            withCredentials: true,
          }
        );
        // Refresh the data after deletion
        handleShow();
        console.log("User deleted successfully");
      } catch (error) {
        console.error("Error deleting user:", error);
        setError("Failed to delete user");
      }
    }
  };

  const handleRefresh = () => {
    handleShow();
  };

  return (
    <>
      <div>
        {/* Debug Info */}
        <div style={{ 
          marginBottom: "20px", 
          padding: "10px", 
          backgroundColor: "#f5f5f5", 
          borderRadius: "4px",
          fontSize: "12px"
        }}>
          <strong>Debug Info:</strong><br />
          Data length: {data.length}<br />
          Loading: {loading.toString()}<br />
          Error: {error || "None"}<br />
          {data.length > 0 && (
            <>
              First user: {JSON.stringify(data[0], null, 2)}<br />
            </>
          )}
        </div>

        {error && (
          <div style={{
            backgroundColor: "#ffebee",
            color: "#c62828",
            padding: "10px",
            marginBottom: "20px",
            borderRadius: "4px",
            border: "1px solid #ef5350"
          }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: "20px" }}>
          <button
            onClick={openSign}
            style={{
              backgroundColor: "#4CAF50",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              marginRight: "10px",
            }}
          >
            Add New User
          </button>
          <button
            onClick={handleRefresh}
            disabled={loading}
            style={{
              backgroundColor: loading ? "#ccc" : "#2196F3",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "4px",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>ID</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Username
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Email
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Role</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((user, index) => (
                <tr key={user.id || index}>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {user.id || "N/A"}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {user.username || "N/A"}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {user.email || "N/A"}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {user.role || "N/A"}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      style={{
                        backgroundColor: "#f44336",
                        color: "white",
                        padding: "5px 10px",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Delete User
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "center",
                  }}
                >
                  {loading ? "Loading..." : error ? `Error: ${error}` : "No users found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Conditionally render SignUp component */}
        {showSignup && <SignUp/>}
      </div>
    </>
  );
}