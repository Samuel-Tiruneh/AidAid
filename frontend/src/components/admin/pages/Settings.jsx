import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SaveIcon } from "lucide-react";
import {
  FaUser,
  FaEnvelope,
  FaKey,
  FaLock,
  FaEyeSlash,
  FaEye,
  FaCamera,
  FaSignOutAlt,
  FaRecycle,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeContext } from "../../../context/ThemeContext";
import { useAuth } from "../../Authentication/AuthContext";

const Settings = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const { user, logout, setUser } = useAuth(); // Destructure setUser
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    location: "",
    profilePicture: "https://randomuser.me/api/portraits/men/32.jpg",
  });
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [eyeSlash, setEyeSlash] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user || !user.id) {
        toast.error("Please log in to continue");
        navigate("/");
        return;
      }

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await axios.get(
          `http://localhost:5000/api/users/${user.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAdminData({
          username: response.data.username,
          email: response.data.email,
          phoneNumber: response.data.phoneNumber || "",
          location: response.data.location || "",
          profilePicture:
            response.data.profilePicture || adminData.profilePicture,
        });
        setIsFetching(false);
      } catch (err) {
        toast.error(
          "Failed to load profile: " +
            (err.response?.data?.message || err.message)
        );
        setIsFetching(false);
      }
    };
    fetchProfile();
  }, [user, navigate]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      const toBase64 = (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });
      const base64Image = await toBase64(file);

      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:5000/api/auth/upload-profile-picture/${user.id}`,
        { image: base64Image },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAdminData((prev) => ({
        ...prev,
        profilePicture: response.data.profilePicture,
      }));
      const updatedUser = {
        ...user,
        profilePicture: response.data.profilePicture,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      toast.success("Profile picture updated successfully!");
    } catch (err) {
      toast.error(
        "Failed to upload picture: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    setErrorMessage("");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/api/auth/update-profile/${user.id}`,
        {
          username: adminData.username,
          email: adminData.email,
          phoneNumber: adminData.phoneNumber,
          location: adminData.location,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAdminData({
        username: response.data.username,
        email: response.data.email,
        phoneNumber: response.data.phoneNumber || "",
        location: response.data.location || "",
        profilePicture:
          response.data.profilePicture || adminData.profilePicture,
      });
      const updatedUser = {
        ...user,
        username: response.data.username,
        email: response.data.email,
        phoneNumber: response.data.phoneNumber,
        location: response.data.location,
        profilePicture: response.data.profilePicture,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser); // Use setUser directly
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(
        "Failed to update profile: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    setErrorMessage("");
    if (!oldPassword) {
      setErrorMessage("Enter your old password first!");
      return;
    }
    if (!newPassword) {
      setErrorMessage("Enter a new password!");
      return;
    }
    if (newPassword.length < 6) {
      setErrorMessage("New password must be at least 6 characters long!");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage("New password and confirm password do not match.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/auth/update-password/${user.id}`,
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || "Failed to update password"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    try {
      logout();
      toast.success("Logged out successfully!", {
        onClose: () => navigate("/"),
      });
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Failed to log out");
    }
  };

  if (isFetching) {
    return (
      <div
        className={`h-full p-6 flex justify-center items-center ${
          isDarkMode ? "bg-gray-900" : "bg-gray-100"
        }`}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div
      className={`h-full p-6 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100"
      }`}
    >
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={isDarkMode ? "dark" : "light"}
      />
      <div className="max-w-2xl mx-auto p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>

        <div
          className={`max-w-2xl mx-auto p-6 rounded-lg shadow-md ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="flex items-center gap-6 mb-6">
            <img
              src={adminData.profilePicture}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover"
            />
            <div>
              <span className="flex items-center gap-2 text-lg font-semibold">
                {adminData.username}
              </span>
              <label className="flex items-center mt-4 gap-2 text-pink-500 cursor-pointer">
                <FaCamera /> Change Profile Picture
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={loading}
                />
              </label>
            </div>
          </div>

          <div className="mb-4">
            <label
              className={`block mb-1 text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              <FaUser className="inline mr-2" /> Username
            </label>
            <input
              type="text"
              name="username"
              value={adminData.username}
              onChange={(e) =>
                setAdminData((prev) => ({ ...prev, username: e.target.value }))
              }
              className={`w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                isDarkMode
                  ? "bg-gray-700 text-white"
                  : "bg-gray-300 text-gray-900"
              }`}
              disabled={loading}
            />
          </div>

          <div className="mb-4">
            <label
              className={`block mb-1 text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              <FaEnvelope className="inline mr-2" /> Email
            </label>
            <input
              type="email"
              name="email"
              value={adminData.email}
              onChange={(e) =>
                setAdminData((prev) => ({ ...prev, email: e.target.value }))
              }
              className={`w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                isDarkMode
                  ? "bg-gray-700 text-white"
                  : "bg-gray-300 text-gray-900"
              }`}
              disabled={loading}
            />
          </div>

          <div className="mb-4">
            <label
              className={`block mb-1 text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              <FaPhone className="inline mr-2" /> Phone Number
            </label>
            <input
              type="text"
              name="phoneNumber"
              value={adminData.phoneNumber}
              onChange={(e) =>
                setAdminData((prev) => ({
                  ...prev,
                  phoneNumber: e.target.value,
                }))
              }
              className={`w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                isDarkMode
                  ? "bg-gray-700 text-white"
                  : "bg-gray-300 text-gray-900"
              }`}
              disabled={loading}
            />
          </div>

          <div className="mb-4">
            <label
              className={`block mb-1 text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              <FaMapMarkerAlt className="inline mr-2" /> Location
            </label>
            <input
              type="text"
              name="location"
              value={adminData.location}
              onChange={(e) =>
                setAdminData((prev) => ({ ...prev, location: e.target.value }))
              }
              className={`w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                isDarkMode
                  ? "bg-gray-700 text-white"
                  : "bg-gray-300 text-gray-900"
              }`}
              disabled={loading}
            />
          </div>

          <div className="mb-4">
            <label
              className={`block mb-1 text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              <FaKey className="inline mr-2" /> Old Password
            </label>
            <input
              type="password"
              name="oldPassword"
              value={oldPassword}
              onChange={(e) => {
                setErrorMessage("");
                setOldPassword(e.target.value);
              }}
              className={`w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                isDarkMode
                  ? "bg-gray-700 text-white"
                  : "bg-gray-300 text-gray-900"
              }`}
              disabled={loading}
            />
          </div>

          <div className="mb-4">
            <label
              className={`block mb-1 text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              <FaLock className="inline mr-2" /> New Password
              {eyeSlash ? (
                <FaEyeSlash
                  onClick={() => setEyeSlash(!eyeSlash)}
                  className="inline ml-2 cursor-pointer"
                />
              ) : (
                <FaEye
                  onClick={() => setEyeSlash(!eyeSlash)}
                  className="inline ml-2 cursor-pointer"
                />
              )}
            </label>
            <input
              type={eyeSlash ? "password" : "text"}
              name="newPassword"
              value={newPassword}
              onChange={(e) => {
                setErrorMessage("");
                setNewPassword(e.target.value);
              }}
              className={`w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                isDarkMode
                  ? "bg-gray-700 text-white"
                  : "bg-gray-300 text-gray-900"
              }`}
              disabled={loading}
            />
          </div>

          <div className="mb-4">
            <label
              className={`block mb-1 text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              <FaLock className="inline mr-2" /> Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => {
                setErrorMessage("");
                setConfirmPassword(e.target.value);
              }}
              className={`w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                isDarkMode
                  ? "bg-gray-700 text-white"
                  : "bg-gray-300 text-gray-900"
              }`}
              disabled={loading}
            />
          </div>

          {errorMessage && (
            <div className="text-red-500 mb-4 font-medium">{errorMessage}</div>
          )}

          <div className="mb-6">
            <button
              onClick={handlePasswordReset}
              className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 ${
                loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              }`}
              disabled={loading}
            >
              <FaRecycle className="inline mr-2" /> Reset Password
            </button>
          </div>

          <div className="flex justify-between pt-4 border-gray-600">
            <button
              onClick={handleSaveChanges}
              className={`bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded flex items-center gap-2 ${
                loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              }`}
              disabled={loading}
            >
              <SaveIcon className="inline mr-2" /> Save Changes
            </button>
            <button
              onClick={handleLogout}
              className={`bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2 ${
                loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              }`}
              disabled={loading}
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;