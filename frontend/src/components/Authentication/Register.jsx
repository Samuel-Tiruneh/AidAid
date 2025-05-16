import React, { useState, useContext } from "react";
import { IoClose } from "react-icons/io5";
import Logo from "../../assets/images/logo.png";
import { FcGoogle } from "react-icons/fc";
import { IoEye, IoEyeOff } from "react-icons/io5";
import Loader from "../../Loader";
import { ThemeContext } from "../../context/ThemeContext";

const Register = ({ isOpen, onClose, openPopup }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Donor", // Default role
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const { isDarkMode } = useContext(ThemeContext);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoleChange = (role) => {
    setFormData({
      ...formData,
      role: role,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          role: formData.role, // Make sure this is included
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Registration response:", data); // Debug log
        setSuccessMessage("You have successfully registered.");
        setTimeout(() => openPopup("login"), 2000);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed, please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  if (!isOpen) return null;

  return (
    <>
      {isLoading && <Loader />}
      <div
        className={`fixed inset-0 font-[poppins] ${
          isLoading ? "backdrop-blur-sm" : ""
        } bg-opacity-30 flex items-center justify-center z-50`}
        onClick={onClose}
      >
        <div
          className={`${
            isDarkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-700"
          } border-t-4 border-b-4 border-pink-400 rounded-lg p-5 w-full max-w-lg relative`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className={`absolute top-2 right-3 text-2xl mb-2 ${
              isDarkMode
                ? "text-gray-300 hover:text-red-400"
                : "text-gray-500 hover:text-red-600"
            }`}
            onClick={onClose}
          >
            <IoClose />
          </button>

          <div className="flex justify-center items-center mb-4">
            <div
              className={`w-18 h-16  flex items-center justify-center border-rounded shadow-md ${
                isDarkMode ? "" : "bg-white"
              }`}
            >
              <img src={Logo} alt="Logo" className="h-14 w-16 rounded-md " />
            </div>
          </div>

          <h2
            className={`text-4xl font-bold font-[poppins] text-center bg-gradient-to-r from-pink-500 to-gray-500 text-transparent bg-clip-text mb-1`}
          >
            Create an Account
          </h2>
          <p
            className={`text-center text-md font-[poppins] ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            } mb-4`}
          >
            Sign up to get started.
          </p>

          {/* Role Selection */}
          <div className="mb-4">
            <p
              className={`text-center ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              } mb-2`}
            >
              What is your role?
            </p>
            <div className="flex justify-center gap-4">
              <button
                type="button"
                onClick={() => handleRoleChange("Donor")}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  formData.role === "Donor"
                    ? "bg-pink-500 text-white"
                    : isDarkMode
                    ? "bg-gray-600 text-gray-200 hover:bg-gray-500"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                } border ${isDarkMode ? "border-gray-600" : "border-gray-300"}`}
              >
                Donor
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange("Requester")}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  formData.role === "Requester"
                    ? "bg-pink-500 text-white"
                    : isDarkMode
                    ? "bg-gray-600 text-gray-200 hover:bg-gray-500"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                } border ${isDarkMode ? "border-gray-600" : "border-gray-300"}`}
              >
                Requester
              </button>
            </div>
          </div>

          <button
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg shadow-sm transition duration-300 mb-3 ${
              isDarkMode
                ? "bg-gray-800 hover:bg-gray-600 border-gray-600 text-gray-200"
                : "bg-white hover:bg-gray-100 border-gray-300 text-gray-600"
            } border`}
          >
            <FcGoogle className="text-xl" />
            <span className="font-medium text-md">Sign Up with Google</span>
          </button>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Full Name"
                className={`w-full px-4 py-3 text-sm rounded-md focus:ring-2 focus:ring-pink-500 focus:outline-none ${
                  isDarkMode
                    ? "bg-gray-500 border-gray-600 text-gray-200"
                    : "bg-white border-gray-300 text-gray-700"
                } border`}
                required
              />
            </div>
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className={`w-full px-4 py-3 text-sm rounded-md focus:ring-2 focus:ring-pink-500 focus:outline-none ${
                  isDarkMode
                    ? "bg-gray-500 border-gray-600 text-gray-200"
                    : "bg-white border-gray-300 text-gray-700"
                } border`}
                required
              />
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className={`w-full px-4 py-3 text-sm rounded-md focus:ring-2 focus:ring-pink-500 focus:outline-none ${
                  isDarkMode
                    ? "bg-gray-500 border-gray-600 text-gray-200"
                    : "bg-white border-gray-300 text-gray-700"
                } border`}
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-pink-500 hover:text-pink-600`}
              >
                {showPassword ? (
                  <IoEyeOff className="text-lg" />
                ) : (
                  <IoEye className="text-lg" />
                )}
              </button>
            </div>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className={`w-full px-4 py-3 text-sm rounded-md focus:ring-2 focus:ring-pink-500 focus:outline-none ${
                  isDarkMode
                    ? "bg-gray-500 border-gray-600 text-gray-200"
                    : "bg-white border-gray-300 text-gray-700"
                } border`}
                required
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-pink-500 hover:text-pink-700`}
              >
                {showConfirmPassword ? (
                  <IoEyeOff className="text-lg" />
                ) : (
                  <IoEye className="text-lg" />
                )}
              </button>
            </div>

            {successMessage && (
              <p className="text-center text-pink-500 font-normal font-[poppins]">
                {successMessage}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-pink-500 text-white text-md font-[poppins] py-3 rounded-md font-bold hover:bg-pink-600 transition duration-300"
            >
              Register
            </button>
          </form>

          <div className="flex justify-center mt-4 text-md">
            <p className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
              Already have an account?{" "}
              <button
                onClick={() => openPopup("login")}
                className="text-pink-500 font-bold hover:underline"
              >
                Log In
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
