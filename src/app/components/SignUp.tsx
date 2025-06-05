import axios from "axios";
import React, { useState, ChangeEvent, FormEvent } from "react";

interface SignUpFormData {
  username: string;
  email: string;
  password: string;
}

export default function SignUp() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<SignUpFormData>({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
       "http://localhost:5000/api/auth/register", // https://dash-backend-vxau.onrender.com/api/auth/register - production link 
       //"https://dash-backend-vxau.onrender.com/api/auth/register",
        formData,
        {
          withCredentials: true,
        }
      );

      console.log("User Registered successful", response.data);
    } catch (error) {
      console.error("Login failed:", error);
      setError("Invalid username or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="signup-container"
      style={{ maxWidth: "400px", margin: "auto" }}
    >
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} className="text-black">
        <div>
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
  );
}
