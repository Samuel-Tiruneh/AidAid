import { useState, useContext } from "react";
import axios from "axios";
import {
  FaHandshake,
  FaUser,
  FaEnvelope,
  FaBuilding,
  FaPaperPlane,
  FaFileUpload,
  FaSpinner,
  FaTimes,
  FaGlobe,
} from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext";

export default function JoinForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    website: "",
    type: "Non-Profit",
    message: "",
    document: null,
    logo: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { isDarkMode } = useContext(ThemeContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    }
  };

  const removeFile = (fieldName) => {
    setFormData({ ...formData, [fieldName]: null });
  };

  const validateForm = () => {
    // Basic field validation
    if (!formData.name.trim()) {
      setError("Please enter your name");
      return false;
    }

    if (!formData.email.trim()) {
      setError("Please enter your email");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (!formData.website.trim()) {
      setError("Please enter your website");
      return false;
    }

    if (!formData.organization.trim()) {
      setError("Please enter your organization name");
      return false;
    }

    if (!formData.message.trim()) {
      setError("Please enter your message");
      return false;
    }

    // File validation
    if (!formData.logo) {
      setError("Logo is required");
      return false;
    }

    const validImageTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validImageTypes.includes(formData.logo.type)) {
      setError("Logo must be a JPG or PNG image");
      return false;
    }

    if (formData.logo.size > 5 * 1024 * 1024) {
      setError("Logo must be smaller than 5MB");
      return false;
    }

    if (formData.document) {
      const validDocTypes = ["application/pdf", "image/jpeg", "image/png"];
      if (!validDocTypes.includes(formData.document.type)) {
        setError("Document must be PDF, JPG, or PNG");
        return false;
      }

      if (formData.document.size > 5 * 1024 * 1024) {
        setError("Document must be smaller than 5MB");
        return false;
      }
    }

    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("website", formData.website);
      formDataToSend.append("organization", formData.organization);
      formDataToSend.append("type", formData.type);
      formDataToSend.append("message", formData.message);
      formDataToSend.append("logo", formData.logo);
      if (formData.document) {
        formDataToSend.append("document", formData.document);
      }

      // Replace the environment variable with localhost:5000
      const response = await axios.post(
        "http://localhost:5000/api/partners", // Changed this line
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        website: "",
        organization: "",
        type: "Non-Profit",
        message: "",
        document: null,
        logo: null,
      });
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(
        err.response?.data?.message ||
          "An error occurred while submitting. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`flex flex-col items-center p-8 rounded-lg shadow-xl max-w-lg w-full border transition-all duration-500 hover:scale-105 ${
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      <h3
        className={`flex text-2xl font-bold text-center mb-4 gap-2 ${
          isDarkMode ? "text-gray-100" : "text-gray-700"
        }`}
      >
        <FaHandshake className="pt-1" /> Join Our Community
      </h3>
      <p
        className={`text-center mb-4 ${
          isDarkMode ? "text-gray-300" : "text-gray-600"
        }`}
      >
        Sign up to become a part of our donation platform and make an impact
        today!
      </p>

      {error && (
        <div
          className={`w-full mb-4 p-3 rounded-lg flex items-center justify-between ${
            isDarkMode ? "bg-red-900 text-red-100" : "bg-red-100 text-red-700"
          }`}
        >
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-2 focus:outline-none"
          >
            <FaTimes />
          </button>
        </div>
      )}

      {success && (
        <div
          className={`w-full mb-4 p-3 rounded-lg ${
            isDarkMode
              ? "bg-green-900 text-green-100"
              : "bg-green-100 text-green-700"
          }`}
        >
          Your request has been submitted successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full">
        {/* Name */}
        <div className="mb-4">
          <label
            className={`block font-medium ${
              isDarkMode ? "text-gray-100" : "text-gray-700"
            }`}
          >
            Your Name
          </label>
          <div className="relative">
            <FaUser
              className={`absolute left-3 top-4 ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-gray-200 focus:ring-pink-500"
                  : "bg-white border-gray-300 text-gray-800 focus:ring-pink-500"
              }`}
              placeholder="Your Name"
              required
            />
          </div>
        </div>

        {/* Organization Name */}
        <div className="mb-4">
          <label
            className={`block font-medium ${
              isDarkMode ? "text-gray-100" : "text-gray-700"
            }`}
          >
            Organization Name
          </label>
          <div className="relative">
            <FaBuilding
              className={`absolute left-3 top-4 ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            />
            <input
              type="text"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              className={`w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-gray-200 focus:ring-pink-500"
                  : "bg-white border-gray-300 text-gray-800 focus:ring-pink-500"
              }`}
              placeholder="Organization Name"
              required
            />
          </div>
        </div>

        {/* Website */}
        <div className="mb-4">
          <label
            className={`block font-medium ${
              isDarkMode ? "text-gray-100" : "text-gray-700"
            }`}
          >
            Website
          </label>
          <div className="relative">
            <FaGlobe
              className={`absolute left-3 top-4 ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            />
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className={`w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-gray-200 focus:ring-pink-500"
                  : "bg-white border-gray-300 text-gray-800 focus:ring-pink-500"
              }`}
              placeholder="Org. website"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label
            className={`block font-medium ${
              isDarkMode ? "text-gray-100" : "text-gray-700"
            }`}
          >
            Email
          </label>
          <div className="relative">
            <FaEnvelope
              className={`absolute left-3 top-4 ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-gray-200 focus:ring-pink-500"
                  : "bg-white border-gray-300 text-gray-800 focus:ring-pink-500"
              }`}
              placeholder="Your Email"
              required
            />
          </div>
        </div>

        {/* Type of Involvement */}
        <div className="mb-4">
          <label
            className={`block font-medium ${
              isDarkMode ? "text-gray-100" : "text-gray-700"
            }`}
          >
            Type of Involvement
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-gray-200 focus:ring-pink-500"
                : "bg-white border-gray-300 text-gray-800 focus:ring-pink-500"
            }`}
            required
          >
            <option value="Non-Profit">Non-Profit</option>
            <option value="Corporate Partner">Corporate Partner</option>
            <option value="Volunteer">Volunteer</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Message */}
        <div className="mb-4">
          <label
            className={`block font-medium ${
              isDarkMode ? "text-gray-100" : "text-gray-700"
            }`}
          >
            Tell us about your organization or how you'd like to get involved
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg mt-1 focus:outline-none focus:ring-2 ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-gray-200 focus:ring-pink-500"
                : "bg-white border-gray-300 text-gray-800 focus:ring-pink-500"
            }`}
            placeholder="Share a brief message..."
            rows="3"
            required
          />
        </div>

        {/* Logo Upload */}
        <div className="mb-4">
          <label
            className={`flex items-center gap-2 font-medium ${
              isDarkMode ? "text-gray-100" : "text-gray-600"
            }`}
          >
            <FaFileUpload className="text-lg" /> Upload Logo (PNG or JPG) *
          </label>
          {formData.logo ? (
            <div
              className={`flex items-center justify-between p-3 mt-1 rounded-lg ${
                isDarkMode ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              <span className="truncate">{formData.logo.name}</span>
              <button
                type="button"
                onClick={() => removeFile("logo")}
                className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
              >
                <FaTimes />
              </button>
            </div>
          ) : (
            <input
              type="file"
              name="logo"
              accept=".png,.jpg,.jpeg"
              onChange={handleFileChange}
              className={`w-full p-2 border rounded-lg mt-1 file:mr-4 file:py-2 file:px-4 file:border-none file:bg-pink-600 file:text-white file:rounded-md cursor-pointer ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-gray-200"
                  : "bg-white border-gray-300 text-gray-800"
              }`}
              required
            />
          )}
        </div>

        {/* Supporting Document Upload */}
        <div className="mb-6">
          <label
            className={`flex items-center gap-2 font-medium ${
              isDarkMode ? "text-gray-100" : "text-gray-600"
            }`}
          >
            <FaFileUpload className="text-lg" /> Upload Supporting Document
            (optional)
          </label>
          {formData.document ? (
            <div
              className={`flex items-center justify-between p-3 mt-1 rounded-lg ${
                isDarkMode ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              <span className="truncate">{formData.document.name}</span>
              <button
                type="button"
                onClick={() => removeFile("document")}
                className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
              >
                <FaTimes />
              </button>
            </div>
          ) : (
            <input
              type="file"
              name="document"
              accept=".pdf,.jpg,.png"
              onChange={handleFileChange}
              className={`w-full p-2 border rounded-lg mt-1 file:mr-4 file:py-2 file:px-4 file:border-none file:bg-pink-600 file:text-white file:rounded-md cursor-pointer ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-gray-200"
                  : "bg-white border-gray-300 text-gray-800"
              }`}
            />
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`mt-6 px-6 py-3 bg-pink-600 text-white rounded-lg text-lg font-semibold w-full transition-transform transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 ${
            isSubmitting ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? (
            <>
              <FaSpinner className="animate-spin" /> Submitting...
            </>
          ) : (
            <>
              Submit Request <FaPaperPlane />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
