import React, { useState, useContext } from "react";
import { IoClose } from "react-icons/io5";
import Logo from "../../assets/images/logo.png";
import { ThemeContext } from "../../context/ThemeContext"; // Import ThemeContext

const ForgotPassword = ({ isOpen, onClose, openPopup }) => {
  const [email, setEmail] = useState("");
  const { isDarkMode } = useContext(ThemeContext); // Use ThemeContext

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Reset password email sent to:", email);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className={`rounded-lg p-8 w-full max-w-md relative shadow-lg ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-700"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Icon */}
        <button
          className={`absolute top-4 right-4 text-3xl ${
            isDarkMode ? "text-gray-300 hover:text-red-400" : "text-pink-600 hover:text-red-600"
          }`}
          onClick={onClose}
        >
          <IoClose />
        </button>

        {/* Title */}
        <h2
          className={`text-2xl font-bold text-center mb-6 ${
            isDarkMode ? "text-gray-100" : "text-gray-800"
          }`}
        >
          Verify Email
        </h2>

        {/* Forgot Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className={`block text-sm font-medium ${
                isDarkMode ? "text-gray-200" : "text-gray-700"
              }`}
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={handleChange}
              className={`w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:border-none focus:outline-none focus:ring focus:ring-pink-500 ${
                isDarkMode ? "bg-gray-700 border-gray-600 text-gray-200" : ""
              }`}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-white bg-pink-500 rounded hover:bg-pink-600 focus:outline-none focus:ring focus:ring-indigo-200"
          >
            Reset Password
          </button>
        </form>

        {/* Links */}
        <div className="flex justify-between mt-4">
          <button
            onClick={() => openPopup("login")}
            className={`text-md hover:font-bold ${
              isDarkMode ? "text-gray-300 hover:text-pink-400" : "text-gray-600 hover:text-pink-600"
            }`}
          >
            Back to Login
          </button>
          <button
            onClick={() => openPopup("register")}
            className={`text-md hover:font-bold ${
              isDarkMode ? "text-gray-300 hover:text-pink-400" : "text-gray-600 hover:text-pink-600"
            }`}
          >
            Create an Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
