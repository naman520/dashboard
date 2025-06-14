"use client";
import React, { useState } from "react";
import SignUp from "../components/SignUp";
import Userstable from "../components/Userstable";
import ProtectedClient from "../components/ProtectedRoute";

interface Team {
  id: number;
  name: string;
}

export default function Dashboard() {
  const [modal, setModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const options = ["Add User", "See All Users"];

  const toggleModal = () => {
    setModal(!modal);
  };

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    toggleModal();
    console.log(`Selected: ${option}`);
  };

  const handleCloseSignUp = () => {
    setSelectedOption(null);
  };

  const handleUserAdded = () => {
    setSelectedOption(null);
    // You might want to refresh the user table here if needed
  };

  // Fetch teams when component mounts
  React.useEffect(() => {
    const fetchTeams = async () => {
      try {
        //const response = await fetch("http://localhost:5000/api/teams", {
        const response = await fetch("https://dash-backend-vxau.onrender.com/api/teams", {
          credentials: "include",
        });
        const data = await response.json();
        if (data.success) {
          setTeams(data.data);
        }
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };
    fetchTeams();
  }, []);

  return (
    <ProtectedClient>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

        <button
          onClick={toggleModal}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Open Menu
        </button>

        {modal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-64">
              <h2 className="text-xl font-semibold mb-4">Select Option</h2>
              <ul className="space-y-2">
                {options.map((option) => (
                  <li key={option}>
                    <button
                      onClick={() => handleOptionClick(option)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded"
                    >
                      {option}
                    </button>
                  </li>
                ))}
              </ul>
              <button
                onClick={toggleModal}
                className="mt-4 w-full bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {selectedOption && (
          <div className="mt-4 p-4 border rounded">
            <h2 className="text-lg font-semibold">
              Selected: {selectedOption}
            </h2>
            {selectedOption === "Add User" && (
              <div className="mt-2">
                <SignUp 
                  onClose={handleCloseSignUp} 
                  onUserAdded={handleUserAdded}
                  teams={teams}
                />
              </div>
            )}
            {selectedOption === "See All Users" && (
              <div className="mt-2">
                <Userstable />
              </div>
            )}
          </div>
        )}
      </div>
    </ProtectedClient>
  );
}