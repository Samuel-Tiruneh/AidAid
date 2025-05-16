import React, { useState, useContext } from "react";
import { IoClose } from "react-icons/io5";
import Logo from "../../assets/images/logo.png";
import { ThemeContext } from "../../context/ThemeContext"; // Import ThemeContext

const EmailVerification = ({ isOpen, onClose, openPopup }) => {
  const [verificationCode, setVerificationCode] = useState("");
  const { isDarkMode } = useContext(ThemeContext); // Use ThemeContext

  const handleChange = (e) => {
    setVerificationCode(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Verification code submitted:", verificationCode);
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
          Pass OTP
        </h2>

        {/* Verification Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="verificationCode"
              className={`block text-sm font-medium ${
                isDarkMode ? "text-gray-200" : "text-gray-700"
              }`}
            >
              Verification Code
            </label>
            <input
              type="text"
              name="verificationCode"
              id="verificationCode"
              value={verificationCode}
              onChange={handleChange}
              className={`w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:border-none focus:outline-none focus:ring focus:ring-pink-500 ${
                isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-700"
              }`}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-white bg-pink-500 rounded hover:bg-pink-600 focus:outline-none focus:ring focus:ring-indigo-200"
          >
            Verify
          </button>
        </form>

        {/* Links */}
        <div className="flex justify-between mt-4">
          <button
            onClick={() => openPopup("forgot-password")}
            className={`text-md hover:font-bold ${
              isDarkMode ? "text-gray-300 hover:text-pink-400" : "text-gray-600 hover:text-pink-600"
            }`}
          >
            Resend Code
          </button>
          <button
            onClick={() => openPopup("login")}
            className={`text-md hover:font-bold ${
              isDarkMode ? "text-gray-300 hover:text-pink-400" : "text-gray-600 hover:text-pink-600"
            }`}
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
