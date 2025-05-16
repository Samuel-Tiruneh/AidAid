import React, { useState } from "react";
import { FiLock, FiEye, FiEyeOff } from "react-icons/fi";

const RequesterChangePassword = ({ onSubmit, isLoading, onCancel }) => {
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const toggleShowPassword = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleChange = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(passwords);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Current Password
        </label>
        <div className="relative">
          <input
            type={showPasswords.oldPassword ? "text" : "password"}
            name="oldPassword"
            value={passwords.oldPassword}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:text-white pr-10"
            required
          />
          <button
            type="button"
            onClick={() => toggleShowPassword("oldPassword")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
          >
            {showPasswords.oldPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          New Password
        </label>
        <div className="relative">
          <input
            type={showPasswords.newPassword ? "text" : "password"}
            name="newPassword"
            value={passwords.newPassword}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:text-white pr-10"
            required
          />
          <button
            type="button"
            onClick={() => toggleShowPassword("newPassword")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
          >
            {showPasswords.newPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Confirm New Password
        </label>
        <div className="relative">
          <input
            type={showPasswords.confirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={passwords.confirmPassword}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:text-white pr-10"
            required
          />
          <button
            type="button"
            onClick={() => toggleShowPassword("confirmPassword")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
          >
            {showPasswords.confirmPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-pink-600 hover:bg-pink-700 text-white py-2 px-6 rounded-md transition-colors"
        >
          {isLoading ? "Updating..." : "Update Password"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 py-2 px-6 rounded-md transition"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default RequesterChangePassword;
