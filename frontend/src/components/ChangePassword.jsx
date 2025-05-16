import React, { useState, useContext } from "react";
import { FaEye, FaEyeSlash, FaLock, FaExchangeAlt, FaTimes } from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext"; // Import ThemeContext

const ChangePassword = ({ onSave, onCancel, userId }) => {
  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const { isDarkMode } = useContext(ThemeContext); // Use ThemeContext

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const toggleShowPassword = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async () => {
    try {
      // Validate new password matching
      if (passwords.newPassword !== passwords.confirmPassword) {
        alert("New passwords do not match!");
        return;
      }

      // Send password update request
      const response = await fetch(
        `http://localhost:5000/api/auth/update-password/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            oldPassword: passwords.oldPassword,
            newPassword: passwords.newPassword,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update password");
      }
      setSuccessMessage("Password updated successfully!");
      console.log(data.message);
      onSave();
    } catch (error) {
      console.error("Error updating password:", error);
      alert(error.message);
    }
  };

  return (
    <div className={`space-y-4 ${isDarkMode ? "text-white" : "text-gray-700"}`}>
      {/* Old Password Input */}
      <div
        className={`flex items-center border p-2 rounded focus-within:border-pink-500 ${
          isDarkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
        }`}
      >
        <FaLock className="mr-2" />
        <input
          type={showPasswords.oldPassword ? "text" : "password"}
          name="oldPassword"
          value={passwords.oldPassword}
          onChange={handleInputChange}
          className={`w-full outline-none ${
            isDarkMode ? "bg-gray-700 text-white" : "bg-white text-gray-700"
          }`}
          placeholder="Old Password"
        />
        <button
          type="button"
          onClick={() => toggleShowPassword("oldPassword")}
          className="ml-2"
        >
          {showPasswords.oldPassword ? (
            <FaEyeSlash className={isDarkMode ? "text-gray-300" : "text-gray-500"} />
          ) : (
            <FaEye className={isDarkMode ? "text-gray-300" : "text-gray-500"} />
          )}
        </button>
      </div>

      {/* New Password Input */}
      <div
        className={`flex items-center border p-2 rounded focus-within:border-pink-500 ${
          isDarkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
        }`}
      >
        <FaLock className="mr-2" />
        <input
          type={showPasswords.newPassword ? "text" : "password"}
          name="newPassword"
          value={passwords.newPassword}
          onChange={handleInputChange}
          className={`w-full outline-none ${
            isDarkMode ? "bg-gray-700 text-white" : "bg-white text-gray-700"
          }`}
          placeholder="New Password"
        />
        <button
          type="button"
          onClick={() => toggleShowPassword("newPassword")}
          className="ml-2"
        >
          {showPasswords.newPassword ? (
            <FaEyeSlash className={isDarkMode ? "text-gray-300" : "text-gray-500"} />
          ) : (
            <FaEye className={isDarkMode ? "text-gray-300" : "text-gray-500"} />
          )}
        </button>
      </div>

      {/* Confirm New Password Input */}
      <div
        className={`flex items-center border p-2 rounded focus-within:border-pink-500 ${
          isDarkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
        }`}
      >
        <FaLock className="mr-2" />
        <input
          type={showPasswords.confirmPassword ? "text" : "password"}
          name="confirmPassword"
          value={passwords.confirmPassword}
          onChange={handleInputChange}
          className={`w-full outline-none ${
            isDarkMode ? "bg-gray-700 text-white" : "bg-white text-gray-700"
          }`}
          placeholder="Confirm New Password"
        />
        <button
          type="button"
          onClick={() => toggleShowPassword("confirmPassword")}
          className="ml-2"
        >
          {showPasswords.confirmPassword ? (
            <FaEyeSlash className={isDarkMode ? "text-gray-300" : "text-gray-500"} />
          ) : (
            <FaEye className={isDarkMode ? "text-gray-300" : "text-gray-500"} />
          )}
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <p className="text-center text-pink-500 font-normal font-[poppins]">
          {successMessage}
        </p>
      )}

      {/* Buttons */}
      <div className="flex flex-col gap-2">
        <button
          onClick={handleSubmit}
          className={`bg-green-500 text-white text-xl px-4 py-2 rounded ${
            isDarkMode ? "hover:bg-green-600" : "hover:bg-green-400"
          } w-full flex items-center justify-center`}
        >
          <FaExchangeAlt className="mr-2" /> Change
        </button>
        <button
          onClick={onCancel}
          className={`bg-pink-500 text-white text-xl px-4 py-2 rounded ${
            isDarkMode ? "hover:bg-pink-600" : "hover:bg-pink-400"
          } w-full flex items-center justify-center`}
        >
          <FaTimes className="mr-2" /> Cancel
        </button>
      </div>
    </div>
  );
};

export default ChangePassword;
