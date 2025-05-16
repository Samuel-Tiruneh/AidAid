import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiLock, FiCamera, FiCheck, FiUpload, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeContext } from "../../context/ThemeContext";

const SettingPage = ({ userId, token }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    location: '',
    profilePicture: '',
    bio: ''
  });
  const { isDarkMode } = useContext(ThemeContext);

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

  const [loading, setLoading] = useState({
    profile: false,
    password: false,
    photo: false
  });
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Load user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData(res.data);
        if (res.data.profilePicture) {
          setPreviewImage(res.data.profilePicture);
        }
      } catch (err) {
        toast.error('Failed to load user data');
      }
    };
    fetchUser();
  }, [userId, token]);

  // Handle image preview
  useEffect(() => {
    if (selectedImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(selectedImage);
    }
  }, [selectedImage]);

  // Calculate password strength
  useEffect(() => {
    if (passwordData.newPassword) {
      let strength = 0;
      if (passwordData.newPassword.length >= 8) strength += 1;
      if (/\d/.test(passwordData.newPassword)) strength += 1;
      if (/[A-Z]/.test(passwordData.newPassword)) strength += 1;
      if (/[^A-Za-z0-9]/.test(passwordData.newPassword)) strength += 1;
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(0);
    }
  }, [passwordData.newPassword]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading({ ...loading, profile: true });
    try {
      const res = await axios.put(
        `http://localhost:5000/api/users/${userId}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFormData(res.data);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating profile');
    } finally {
      setLoading({ ...loading, profile: false });
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setLoading({ ...loading, password: true });
    try {
      await axios.put(
        `http://localhost:5000/api/auth/update-password/${userId}`,
        { oldPassword: passwordData.oldPassword, newPassword: passwordData.newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error changing password');
    } finally {
      setLoading({ ...loading, password: false });
    }
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!selectedImage) {
      toast.error('Please select an image first');
      return;
    }

    setLoading({ ...loading, photo: true });

    try {
      // Validate image
      if (!selectedImage.type.match('image.*')) {
        throw new Error('Only image files are allowed');
      }
      if (selectedImage.size > 5 * 1024 * 1024) {
        throw new Error('Image size must be less than 5MB');
      }

      // 1. Get signature from backend
      const sigRes = await axios.post('http://localhost:5000/api/cloudinary-signature');
      const { signature, timestamp, apiKey, cloudName } = sigRes.data;

      // 2. Upload to Cloudinary with signature
      const formData = new FormData();
      formData.append('file', selectedImage);
      formData.append('api_key', apiKey);
      formData.append('timestamp', timestamp);
      formData.append('signature', signature);

      const cloudinaryResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      const imageUrl = cloudinaryResponse.data.secure_url;
      if (!imageUrl) {
        throw new Error('Cloudinary upload failed - no secure URL returned');
      }

      // 3. Save to backend
      const backendResponse = await axios.put(
        `http://localhost:5000/api/users/${userId}/profilePicture`,
        { profilePicture: imageUrl },
        {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        }
      );

      // Update state
      setFormData(prev => ({ ...prev, profilePicture: imageUrl }));
      setPreviewImage(imageUrl);
      setSelectedImage(null);
      toast.success('Profile picture updated successfully!');
    } catch (err) {
      console.error('Full upload error:', err);
      toast.error(err.response?.data?.message || err.message || 'Failed to upload profile picture');
    } finally {
      setLoading({ ...loading, photo: false });
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setPreviewImage(formData.profilePicture || '');
  };

  const getPasswordStrengthColor = () => {
    switch(passwordStrength) {
      case 1: return 'bg-red-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-blue-500';
      case 4: return 'bg-green-500';
      default: return isDarkMode ? 'bg-gray-700' : 'bg-gray-200';
    }
  };

  // Helper function for input classes
  const getInputClasses = () => {
    return `block w-full rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border transition-all duration-200 ${
      isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 bg-white text-gray-900'
    }`;
  };

  // Helper function for label classes
  const getLabelClasses = () => {
    return `block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`;
  };
  return (
    <div className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
        : 'bg-gradient-to-br from-gray-50 to-gray-100'
    }`}>
      <div className="max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center mb-10"
        >
          <h1 className={`text-4xl font-bold mb-2 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Account Settings
          </h1>
          <p className={`text-lg ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Manage your profile information and security settings
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className={`rounded-2xl shadow-xl overflow-hidden ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          {/* Tabs */}
          <div className={`border-b ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <nav className="flex">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center justify-center py-5 px-6 text-center font-medium text-sm transition-all duration-300 ${
                  activeTab === 'profile' 
                    ? `${isDarkMode ? 'text-blue-400 border-blue-500' : 'text-blue-600 border-blue-500'} border-b-2` 
                    : `${isDarkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
                }`}
              >
                <FiUser className="mr-2" />
                Profile
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`flex items-center justify-center py-5 px-6 text-center font-medium text-sm transition-all duration-300 ${
                  activeTab === 'password' 
                    ? `${isDarkMode ? 'text-blue-400 border-blue-500' : 'text-blue-600 border-blue-500'} border-b-2` 
                    : `${isDarkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
                }`}
              >
                <FiLock className="mr-2" />
                Password
              </button>
              <button
                onClick={() => setActiveTab('photo')}
                className={`flex items-center justify-center py-5 px-6 text-center font-medium text-sm transition-all duration-300 ${
                  activeTab === 'photo' 
                    ? `${isDarkMode ? 'text-blue-400 border-blue-500' : 'text-blue-600 border-blue-500'} border-b-2` 
                    : `${isDarkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
                }`}
              >
                <FiCamera className="mr-2" />
                Photo
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <form onSubmit={handleUpdateProfile}>
                    <div className="space-y-8">
                      <div>
                        <h3 className={`text-xl font-semibold mb-2 ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          Personal Information
                        </h3>
                        <p className={`text-sm ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          Update your personal details here.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                          <label htmlFor="username" className={getLabelClasses()}>
                            Username
                          </label>
                          <input
                            type="text"
                            name="username"
                            id="username"
                            value={formData.username || ''}
                            onChange={handleChange}
                            className={getInputClasses()}
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label htmlFor="email" className={getLabelClasses()}>
                            Email address
                          </label>
                          <input
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email || ''}
                            onChange={handleChange}
                            className={getInputClasses()}
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label htmlFor="phoneNumber" className={getLabelClasses()}>
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            name="phoneNumber"
                            id="phoneNumber"
                            value={formData.phoneNumber || ''}
                            onChange={handleChange}
                            className={getInputClasses()}
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label htmlFor="location" className={getLabelClasses()}>
                            Location
                          </label>
                          <input
                            type="text"
                            name="location"
                            id="location"
                            value={formData.location || ''}
                            onChange={handleChange}
                            className={getInputClasses()}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-10 flex justify-end">
                      <button
                        type="submit"
                        disabled={loading.profile}
                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        {loading.profile ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                          </>
                        ) : (
                          <>
                            <FiCheck className="mr-2" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Password Tab */}
              {activeTab === 'password' && (
                <motion.div
                  key="password"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <form onSubmit={handleChangePassword}>
                    <div className="space-y-8">
                      <div>
                        <h3 className={`text-xl font-semibold mb-2 ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          Change Password
                        </h3>
                        <p className={`text-sm ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          Ensure your account is using a long, random password to stay secure.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-6">
                        <div className="sm:col-span-6">
                          <label htmlFor="oldPassword" className={getLabelClasses()}>
                            Current Password
                          </label>
                          <input
                            type="password"
                            name="oldPassword"
                            id="oldPassword"
                            value={passwordData.oldPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                            className={getInputClasses()}
                          />
                        </div>

                        <div className="sm:col-span-6">
                          <label htmlFor="newPassword" className={getLabelClasses()}>
                            New Password
                          </label>
                          <input
                            type="password"
                            name="newPassword"
                            id="newPassword"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            className={getInputClasses()}
                          />
                          <div className="mt-2">
                            <div className="flex items-center space-x-1">
                              {[1, 2, 3, 4].map((i) => (
                                <div 
                                  key={i} 
                                  className={`h-1.5 rounded-full w-full transition-all duration-300 ${
                                    i <= passwordStrength ? getPasswordStrengthColor() : isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                                  }`}
                                />
                              ))}
                            </div>
                            <p className={`text-xs mt-1 ${
                              isDarkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              {passwordStrength === 0 ? 'Very weak' : 
                               passwordStrength === 1 ? 'Weak' : 
                               passwordStrength === 2 ? 'Moderate' : 
                               passwordStrength === 3 ? 'Strong' : 'Very strong'}
                            </p>
                          </div>
                        </div>

                        <div className="sm:col-span-6">
                          <label htmlFor="confirmPassword" className={getLabelClasses()}>
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            className={getInputClasses()}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-10 flex justify-end">
                      <button
                        type="submit"
                        disabled={loading.password}
                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        {loading.password ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Updating...
                          </>
                        ) : (
                          <>
                            <FiCheck className="mr-2" />
                            Update Password
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Photo Tab */}
              {activeTab === 'photo' && (
                <motion.div
                  key="photo"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <form onSubmit={handleImageUpload}>
                    <div className="space-y-8">
                      <div>
                        <h3 className={`text-xl font-semibold mb-2 ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          Profile Photo
                        </h3>
                        <p className={`text-sm ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          Update your profile photo here.
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
                        <div className="relative">
                          <div className={`w-32 h-32 rounded-full overflow-hidden border-4 shadow-lg ${
                            isDarkMode ? 'border-gray-700' : 'border-white'
                          }`}>
                            {previewImage ? (
                              <img 
                                src={previewImage} 
                                alt="Profile" 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className={`w-full h-full flex items-center justify-center ${
                                isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-500'
                              }`}>
                                <FiUser size={48} />
                              </div>
                            )}
                          </div>
                          {selectedImage && (
                            <button
                              type="button"
                              onClick={removeImage}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-all duration-200"
                            >
                              <FiX size={16} />
                            </button>
                          )}
                        </div>

                        <div className="flex-1">
                          <label className={getLabelClasses()}>
                            Upload a new photo
                          </label>
                          <div className="flex items-center gap-4">
                            <label
                              htmlFor="file-upload"
                              className={`cursor-pointer py-3 px-4 rounded-lg shadow-sm text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 inline-flex items-center ${
                                isDarkMode
                                  ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                                  : 'bg-white border-gray-300 text-gray-700 border'
                              }`}
                            >
                              <FiUpload className="mr-2" />
                              <span>Select File</span>
                              <input 
                                id="file-upload" 
                                name="file-upload" 
                                type="file" 
                                className="sr-only" 
                                onChange={(e) => setSelectedImage(e.target.files[0])} 
                                accept="image/*"
                              />
                            </label>
                            <span className={`text-sm ${
                              isDarkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              {selectedImage ? selectedImage.name : 'No file selected'}
                            </span>
                          </div>
                          <p className={`mt-2 text-xs ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            JPG, GIF or PNG. Max size 2MB.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-10 flex justify-end">
                      <button
                        type="submit"
                        disabled={loading.photo || !selectedImage}
                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        {loading.photo ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <FiCheck className="mr-2" />
                            Upload Photo
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingPage;