import React, { useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { FaEnvelope, FaTrashAlt, FaBan } from "react-icons/fa";
import { ThemeContext } from "../../../../context/ThemeContext";

const UserDetail = () => {
  const { id } = useParams(); // Get user ID from the URL
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");

  const { isDarkMode } = useContext(ThemeContext);

  // Example user data — in real app, fetch based on `id`
  const user = {
    pic: "https://randomuser.me/api/portraits/women/44.jpg",
    name: "Bety Naty",
    email: "vd@exam.com",
    location: "Hawassa",
    role: "donor",
  };

  const handleSend = () => {
    alert(`Message sent to ${user.name}: ${message}`);
    setMessage("");
    setIsModalOpen(false);
  };

  return (
    <div
      className={`p-6 h-full ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div
        className={`max-w-2xl mx-auto p-6 rounded-lg shadow-md ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        <div className="flex items-center gap-6">
          <img
            src={user.pic}
            alt={user.name}
            className="w-24 h-24 rounded-full object-cover"
          />
          <div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Email:{" "}
              <span className="text-pink-500 font-semibold">{user.email}</span>
            </p>
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Location:{" "}
              <span className="font-semibold text-green-600">
                {user.location}
              </span>
            </p>
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Role:{" "}
              <span className="capitalize font-semibold text-pink-500">
                {user.role}
              </span>
            </p>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <button
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white flex items-center gap-2"
            onClick={() => alert("User has been banned")}
          >
            <FaBan />
            Ban
          </button>
          <button
            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-white flex items-center gap-2"
            onClick={() => alert("User has been removed")}
          >
            <FaTrashAlt />
            Remove
          </button>
          <button
            className="bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded text-white flex items-center gap-2"
            onClick={() => setIsModalOpen(true)}
          >
            <FaEnvelope />
            Send Message
          </button>
        </div>

        {/* Message Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-gray-900 p-6 rounded-lg w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">
                Send Message to {user.name}
              </h3>
              <textarea
                className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
                rows="4"
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSend}
                  className="px-4 py-2 bg-pink-600 rounded text-white hover:bg-pink-700"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetail;
