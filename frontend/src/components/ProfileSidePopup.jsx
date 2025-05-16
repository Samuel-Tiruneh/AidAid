import React, { useState, useEffect, useContext } from "react";
import {
  FaRegUserCircle,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaUserEdit,
  FaKey,
  FaHistory,
  FaTimes,
} from "react-icons/fa";
import CustomizeProfile from "./CustomizeProfile";
import ChangePassword from "./ChangePassword";
import profilePlaceholder from "../assets/images/profile.jpg";
import { ThemeContext } from "../context/ThemeContext"; // Import ThemeContext

const ProfileSidePopup = ({ user, setIsSidePopupOpen }) => {
  const [viewMode, setViewMode] = useState("view"); // "view", "edit", "password"
  const [userData, setUserData] = useState({
    username: user.username || "",
    email: user.email || "",
    phone: user.phoneNumber || "",
    address: user.location || "",
    profilePicture: user.profilePicture || profilePlaceholder,
    _id: user.id || "",
  });

  const { isDarkMode } = useContext(ThemeContext); // Use ThemeContext

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/auth/user/${userData._id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        setUserData({
          username: data.username || "",
          email: data.email || "",
          phone: data.phoneNumber || "",
          address: data.location || "",
          profilePicture: data.profilePicture || profilePlaceholder,
          _id: data._id || "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userData._id]); // Re-fetch when the user ID changes

  const handleSaveProfile = (updatedUserData) => {
    console.log("Updated User Data from Child:", updatedUserData); // Log the updated user data
    setUserData((prevData) => ({
      ...prevData,
      username: updatedUserData.username || prevData.username, // Update username
      email: updatedUserData.email || prevData.email, // Update email
      phone: updatedUserData.phoneNumber || prevData.phone, // Map phoneNumber to phone
      address: updatedUserData.location || prevData.address, // Map location to address
      profilePicture: updatedUserData.profilePicture || prevData.profilePicture,
    }));
    setViewMode("view"); // Switch back to view mode
  };

  const handlePasswordUpdate = (passwordData) => {
    console.log("Password updated:", passwordData);
    alert("Password updated successfully!");
    setViewMode("view");
  };

  const handleTransactionHistory = () => {
    // Logic for handling transaction history view
    alert("Transaction history section to be implemented.");
  };

  return (
    <div
      className={`fixed top-0 right-0 w-96 h-full shadow-lg p-6 overflow-y-auto z-50 flex flex-col justify-between ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-700"
      }`}
    >
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-['Poppins'] text-pink-500 font-bold">
            {viewMode === "edit"
              ? "Edit Profile"
              : viewMode === "password"
              ? "Change Password"
              : "Profile"}
          </h2>
          <button
            onClick={() => setIsSidePopupOpen(false)}
            className={`text-xl ${
              isDarkMode ? "text-gray-300 hover:text-red-400" : "text-gray-500 hover:text-pink-700"
            }`}
          >
            <FaTimes />
          </button>
        </div>

        {/* Profile Picture */}
        <div className="flex flex-col items-center mb-4">
          <img
            src={userData.profilePicture}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-pink-200"
          />
          <h3 className="text-xl font-semibold mt-2 font-[Poppins]">
            {userData.username}
          </h3>
        </div>

        {/* Profile Details */}
        {viewMode === "edit" ? (
          <CustomizeProfile
            userData={userData}
            onSave={handleSaveProfile}
            onCancel={() => setViewMode("view")}
          />
        ) : viewMode === "password" ? (
          <ChangePassword
            onSave={handlePasswordUpdate}
            onCancel={() => setViewMode("view")}
            userId={user?.id}
          />
        ) : (
          <div className="space-y-4 mt-4">
            <div
              className={`flex items-center p-2 rounded ${
                isDarkMode ? "bg-gray-700" : "bg-pink-100"
              } mb-2 font-[Poppins]`}
            >
              <FaRegUserCircle className="mr-2 text-pink-600" />
              <span>{userData.username}</span>
            </div>
            <div
              className={`flex items-center p-2 rounded ${
                isDarkMode ? "bg-gray-700" : "bg-pink-100"
              } mb-2 font-[Poppins]`}
            >
              <FaEnvelope className="mr-2 text-pink-600" />
              <span>{userData.email}</span>
            </div>
            <div
              className={`flex items-center p-2 rounded ${
                isDarkMode ? "bg-gray-700" : "bg-pink-100"
              } mb-2 font-[Poppins]`}
            >
              <FaPhone className="mr-2 text-pink-600" />
              <span>{userData.phone || "Not specified"}</span>{" "}
              {/* Show placeholder text if no phone number */}
            </div>
            <div
              className={`flex items-center p-2 rounded ${
                isDarkMode ? "bg-gray-700" : "bg-pink-100"
              } mb-2 font-[Poppins] mb-8`}
            >
              <FaMapMarkerAlt className="mr-2 text-pink-600" />
              <span>{userData.address || "Not specified"}</span>{" "}
              {/* Show placeholder text if no address */}
            </div>

            {/* Buttons */}
            <button
              onClick={() => setViewMode("edit")}
              className={`bg-gray-400 px-4 py-2 text-lg text-white rounded hover:bg-gray-500 w-full font-[Poppins] cursor-pointer flex items-center justify-center`}
            >
              <FaUserEdit className="mr-2" />
              Customize Profile
            </button>
            <button
              onClick={() => setViewMode("password")}
              className={`bg-gray-400 px-4 py-2 text-lg text-white rounded hover:bg-gray-500 w-full font-[Poppins] cursor-pointer flex items-center justify-center`}
            >
              <FaKey className="mr-2" />
              Change Password
            </button>

            <button
              onClick={handleTransactionHistory}
              className={`bg-gray-400 px-4 py-2 text-lg text-white rounded hover:bg-gray-500 w-full font-[Poppins] cursor-pointer flex items-center justify-center`}
            >
              <FaHistory className="mr-2" />
              Transaction & History
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSidePopup;
