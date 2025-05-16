import React, { useContext, useState } from "react";
import { ThemeContext } from "../../../context/ThemeContext";

const AddAdmin = () => {
  const { isDarkMode } = useContext(ThemeContext);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Admin", // Fixed role for admin
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Send token if needed
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          role: formData.role,
        }),
      });

      if (!response.ok) {
        let errorMessage = "Something went wrong";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (err) {
          // If error response has no JSON, keep default errorMessage
        }
        throw new Error(errorMessage);
      }

      // ✅ Check if response has content before parsing JSON
      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      setSuccess(data.message || "Admin added successfully!");
      console.log("Registration response:", data); // Debug log
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "Admin",
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      className={`flex mb-6 flex-col items-center justify-center h-full ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <h1 className="text-2xl font-bold mb-4 mt-3">Add Admin</h1>

      <form
        className={`p-6 rounded-lg shadow-md w-96 ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
        onSubmit={handleSubmit}
      >
        {error && (
          <div className="mb-4 text-red-500 text-sm font-semibold">{error}</div>
        )}
        {success && (
          <div className="mb-4 text-green-500 text-sm font-semibold">
            {success}
          </div>
        )}
        {/* Full Name */}
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="username">
            Full Name
          </label>
          <input
            type="text"
            id="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter full name"
            className={`shadow appearance-none rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${
              isDarkMode ? "bg-gray-700" : "bg-gray-200"
            }`}
            required
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
            className={`shadow appearance-none rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${
              isDarkMode ? "bg-gray-700" : "bg-gray-200"
            }`}
            required
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
            className={`shadow appearance-none rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${
              isDarkMode ? "bg-gray-700" : "bg-gray-200"
            }`}
            required
          />
        </div>

        {/* Confirm Password */}
        <div className="mb-4">
          <label
            className="block text-sm font-bold mb-2"
            htmlFor="confirmPassword"
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm password"
            className={`shadow appearance-none rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${
              isDarkMode ? "bg-gray-700" : "bg-gray-200"
            }`}
            required
          />
        </div>

        {/* Role - fixed to Admin */}
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="role">
            Role
          </label>
          <select
            id="role"
            value={formData.role}
            onChange={handleChange}
            disabled
            className={`shadow appearance-none rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline cursor-not-allowed ${
              isDarkMode ? "bg-gray-700" : "bg-gray-200"
            }`}
          >
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Submit Button */}
        <input
          type="submit"
          value="Add Admin"
          className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer"
        />
      </form>
    </div>
  );
};

export default AddAdmin;
