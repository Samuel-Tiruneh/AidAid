import React, { useState, useEffect } from "react";
import { useAuth } from "../../components/Authentication/AuthContext";
import { FiUser, FiMail, FiLock, FiGlobe, FiSave } from "react-icons/fi";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import RequesterChangePassword from "./RequesterChangePassword";

// Use your own placeholder image path here
const profilePlaceholder = "https://via.placeholder.com/150";

const RequesterProfile = () => {
  const { user, token, refreshUserData } = useAuth();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    bio: "",
    location: "",
    phoneNumber: "",
  });
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile({
        username: user.username || "",
        email: user.email || "",
        bio: user.bio || "",
        location: user.location || "",
        phoneNumber: user.phoneNumber || "",
      });
      setProfilePicturePreview(user.profilePicture || null);
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  // Handle file input and preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePictureFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.id) {
      setMessage({
        text: "Cannot update profile: User information is missing. Please log in again.",
        type: "error",
      });
      return;
    }
    setIsLoading(true);

    try {
      // Prepare the update data
      const updateData = {
        username: profile.username,
        email: profile.email,
        phoneNumber: profile.phoneNumber,
        location: profile.location,
        bio: profile.bio,
      };

      // Upload profile picture if changed
      if (profilePictureFile) {
        const formData = new FormData();
        formData.append("profileImage", profilePictureFile);

        const uploadResponse = await fetch(
          `http://localhost:5000/api/auth/upload-profile-picture/${user.id}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token || localStorage.getItem("token")}`,
            },
            body: formData,
          }
        );

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload profile picture");
        }

        const uploadData = await uploadResponse.json();
        // Save the returned image URL to updateData
        updateData.profilePicture = uploadData.profilePicture;
      }

      // Update profile information
      const response = await fetch(
        `http://localhost:5000/api/auth/update-profile/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token || localStorage.getItem("token")}`,
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      setMessage({ text: "Profile updated successfully!", type: "success" });

      // Refresh user data in context to update navbar and other components
      if (typeof refreshUserData === "function") {
        await refreshUserData();
      }
      setProfilePictureFile(null);
    } catch (error) {
      setMessage({ text: error.message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (passwords) => {
    setIsLoading(true);

    try {
      if (!user?.id) {
        throw new Error("User information is missing");
      }
      if (passwords.newPassword !== passwords.confirmPassword) {
        throw new Error("New passwords do not match");
      }

      const response = await fetch(
        `http://localhost:5000/api/auth/update-password/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token || localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            oldPassword: passwords.oldPassword,
            newPassword: passwords.newPassword,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update password");
      }

      setMessage({ text: "Password updated successfully!", type: "success" });
      setShowPasswordForm(false);
    } catch (error) {
      setMessage({ text: error.message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-4xl mx-auto my-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Account Settings
      </h2>

      {/* Message Display */}
      {message.text && (
        <div
          className={`mb-6 p-3 rounded-md ${
            message.type === "success"
              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
              : "bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300"
          }`}
        >
          {message.text}
        </div>
      )}

      {!showPasswordForm ? (
        <>
          <button
            onClick={() => setShowPasswordForm(true)}
            className="mb-6 text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 font-medium flex items-center gap-2"
          >
            <FiLock /> Change Password
          </button>

          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile Picture Upload */}
              <div className="flex flex-col items-center md:w-1/3">
                <div className="relative mb-4">
                  <img
                    src={profilePicturePreview || user?.profilePicture || profilePlaceholder}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-pink-200 dark:border-pink-600/50 shadow"
                  />
                </div>
                <label className="cursor-pointer">
                  <span className="block w-full text-center bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300 py-2 px-4 rounded-md hover:bg-pink-100 dark:hover:bg-pink-900/30 transition">
                    Change Photo
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Profile Fields */}
              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                    <FiUser className="mr-2 text-pink-500 dark:text-pink-400" />
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={profile.username}
                    onChange={handleProfileChange}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                    <FiMail className="mr-2 text-pink-500 dark:text-pink-400" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                    <FiGlobe className="mr-2 text-pink-500 dark:text-pink-400" />
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={profile.location}
                    onChange={handleProfileChange}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:text-white"
                    placeholder="City, Country"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                    <FiGlobe className="mr-2 text-pink-500 dark:text-pink-400" />
                    Phone Number
                  </label>
                  <PhoneInput
                    international
                    defaultCountry="ET"
                    value={profile.phoneNumber}
                    onChange={(phoneNumber) =>
                      setProfile({ ...profile, phoneNumber })
                    }
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="bg-pink-600 hover:bg-pink-700 text-white py-2 px-6 rounded-md transition-colors flex items-center justify-center gap-2"
            >
              <FiSave /> {isLoading ? "Saving..." : "Save Profile"}
            </button>
          </form>
        </>
      ) : (
        <div>
          <button
            onClick={() => setShowPasswordForm(false)}
            className="mb-6 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white font-medium flex items-center gap-2"
          >
            ← Back to Profile
          </button>
          <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
            Change Password
          </h3>
          <RequesterChangePassword
            onSubmit={handlePasswordSubmit}
            isLoading={isLoading}
            onCancel={() => setShowPasswordForm(false)}
          />
        </div>
      )}
    </div>
  );
};

export default RequesterProfile;
