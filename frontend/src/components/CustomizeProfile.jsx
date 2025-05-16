import React, { useState, useContext } from "react";
import {
  FaRegUserCircle,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaEdit,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css"; // Import styles for PhoneInput
import { ThemeContext } from "../context/ThemeContext"; // Import ThemeContext

const CustomizeProfile = ({ userData, onSave, onCancel }) => {
  const { isDarkMode } = useContext(ThemeContext); // Use ThemeContext
  const [updatedData, setUpdatedData] = useState(userData);
  const [profilePicture, setProfilePicture] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState({
    username: false,
    email: false,
    phone: false,
    address: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result); // Base64-encoded image
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditClick = (field) => {
    setEditing((prev) => ({ ...prev, [field]: true }));
  };

  const handleSave = async () => {
    try {
      setUploading(true);

      // Upload profile picture to Cloudinary
      let profilePictureUrl = updatedData.profilePicture;
      if (profilePicture) {
        const response = await fetch(
          `http://localhost:5000/api/auth/upload-profile-picture/${updatedData._id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ image: profilePicture }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to upload profile picture");
        }

        const data = await response.json();
        profilePictureUrl = data.profilePicture;
      }

      // Update other profile fields
      const updatedFields = {
        username: updatedData.username, // Include username
        email: updatedData.email, // Include email
      };
      if (updatedData.phone !== userData.phone) {
        updatedFields.phoneNumber = updatedData.phone;
      }
      if (updatedData.address !== userData.address) {
        updatedFields.location = updatedData.address;
      }

      // Send updated data to the backend
      const response = await fetch(
        `http://localhost:5000/api/auth/update-profile/${updatedData._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...updatedFields,
            profilePicture: profilePictureUrl,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedUser = await response.json();
      console.log("Updated User from Backend:", updatedUser); // Log the updated user data
      onSave(updatedUser); // Pass the updated user data to the parent component
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`flex flex-col items-center ${
      isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-700"
    } p-4 rounded-md`}>
      {/* Profile Picture Upload */}
      <div className="mb-4 flex flex-col items-center">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className={`mb-2 ${
            isDarkMode ? "file:bg-gray-700 file:text-gray-300" : ""
          }`}
        />
        {profilePicture && (
          <img
            src={profilePicture}
            alt="Preview"
            className="w-32 h-32 rounded-full object-cover"
          />
        )}
      </div>

      {/* Input Fields */}
      <div className="w-full">
        {/* Username */}
        <div className="flex items-center mb-2 font-['Poppins']">
          <FaRegUserCircle className="mr-2 text-pink-500 text-xl" />
          <input
            type="text"
            name="username"
            value={updatedData.username}
            onChange={handleInputChange}
            className={`w-full p-2 rounded ${
              editing.username ? "border-2 border-pink-500" : "border"
            } ${isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-700 border-gray-300"}`}
            placeholder="Username"
            disabled={!editing.username}
          />
          <FaEdit
            onClick={() => handleEditClick("username")}
            className="ml-2 cursor-pointer text-gray-500 text-2xl"
          />
        </div>

        {/* Email */}
        <div className="flex items-center mb-2 font-['Poppins']">
          <FaEnvelope className="mr-2 text-pink-500 text-xl" />
          <input
            type="email"
            name="email"
            value={updatedData.email}
            onChange={handleInputChange}
            className={`w-full p-2 rounded ${
              editing.email ? "border-2 border-pink-500" : "border"
            } ${isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-700 border-gray-300"}`}
            placeholder="Email"
            disabled={!editing.email}
          />
          <FaEdit
            onClick={() => handleEditClick("email")}
            className="ml-2 cursor-pointer text-gray-500 text-2xl"
          />
        </div>

        {/* Phone */}
        <div className="flex items-center mb-2 font-['Poppins']">
          <FaPhone className="mr-2 text-pink-500 text-xl" />
          {editing.phone ? (
            <PhoneInput
              international
              defaultCountry="ET" // Default country code (Ethiopia)
              value={updatedData.phone}
              onChange={(phone) =>
                setUpdatedData((prev) => ({ ...prev, phone }))
              }
              className={`w-full p-2 rounded border-2 border-pink-500 ${
                isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-700 border-gray-300"
              }`}
            />
          ) : (
            <input
              type="text"
              name="phone"
              value={updatedData.phone || ""}
              onChange={handleInputChange}
              className={`w-full p-2 rounded ${
                editing.phone ? "border-2 border-pink-500" : "border"
              } ${isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-700 border-gray-300"}`}
              placeholder={updatedData.phone ? "" : "Add phone number"}
              disabled={!editing.phone}
            />
          )}
          <FaEdit
            onClick={() => handleEditClick("phone")}
            className="ml-2 cursor-pointer text-gray-500 text-2xl"
          />
        </div>

        {/* Address */}
        <div className="flex items-center mb-2 font-['Poppins']">
          <FaMapMarkerAlt className="mr-2 text-pink-500 text-xl" />
          <input
            type="text"
            name="address"
            value={updatedData.address}
            onChange={handleInputChange}
            className={`w-full p-2 rounded ${
              editing.address ? "border-2 border-pink-500" : "border"
            } ${isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-700 border-gray-300"}`}
            placeholder={editing.address ? "" : "City, State, or Country"}
            disabled={!editing.address}
          />
          <FaEdit
            onClick={() => handleEditClick("address")}
            className="ml-2 cursor-pointer text-gray-500 text-2xl"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-2 mt-4 w-full">
        <button
          onClick={handleSave}
          disabled={uploading}
          className={`bg-green-500 text-white text-xl px-4 py-2 rounded hover:bg-green-600 w-full flex items-center justify-center ${
            isDarkMode ? "hover:bg-green-500" : ""
          }`}
        >
          <FaSave className="mr-2" />
          {uploading ? "Saving..." : "Save"}
        </button>
        <button
          onClick={onCancel}
          className={`bg-pink-500 text-white text-xl px-4 py-2 rounded hover:bg-pink-600 w-full flex items-center justify-center ${
            isDarkMode ? "hover:bg-pink-500" : ""
          }`}
        >
          <FaTimes className="mr-2" />
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CustomizeProfile;
