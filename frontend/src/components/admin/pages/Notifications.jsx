import React, { useState, useContext } from "react";
import { FaBell, FaTrash, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { ThemeContext } from "../../../context/ThemeContext";

const Notifications = () => {
  const { isDarkMode } = useContext(ThemeContext);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New user registered",
      message:
        "A new user has just signed up from Addis Ababa. Their email is abera@gmail.com and they selected 'user' as their role during signup. Please verify the information.",
      date: "Apr 10, 2025",
      time: "10:30 AM",
    },
    {
      id: 2,
      title: "Donation Received",
      message:
        "You received a $100 donation from John Doe. Donation was marked as urgent help and is directed towards a campaign in Hawassa.",
      date: "Apr 9, 2025",
      time: "2:15 PM",
    },
    {
      id: 3,
      title: "Admin Added",
      message:
        "A new admin named Bety Naty was added to the system with email vd@exam.com. Please ensure their permissions are correctly configured.",
      date: "Apr 8, 2025",
      time: "1:00 PM",
    },
  ]);

  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleDelete = (id) => {
    setNotifications((prev) => prev.filter((note) => note.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  return (
    <div
      className={` p-4 h-full ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100"
      }`}
    >
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <FaBell /> Notifications
      </h1>

      {notifications.length === 0 ? (
        <p className="text-gray-400">No notifications at the moment.</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((note) => (
            <div
              key={note.id}
              className={`p-4 rounded-lg shadow ${
                isDarkMode
                  ? "bg-gray-800 text-gray-300"
                  : "bg-pink-200 text-gray-800"
              }`}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h2 className="font-semibold text-lg">{note.title}</h2>
                  <p
                    className={`text-sm mt-1 ${
                      isDarkMode ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    {note.date}{" "}
                    <span className="text-pink-500"> {note.time}</span>
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="bg-pink-500 hover:bg-pink-600 text-white text-sm px-3 py-1 rounded flex items-center gap-1"
                  >
                    <FaTrash /> Delete
                  </button>
                  <button
                    onClick={() => toggleExpand(note.id)}
                    className="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1 rounded flex items-center gap-1"
                  >
                    {expandedId === note.id ? (
                      <>
                        <FaChevronUp /> Show Less
                      </>
                    ) : (
                      <>
                        <FaChevronDown /> See More
                      </>
                    )}
                  </button>
                </div>
              </div>

              {expandedId === note.id && (
                <div
                  className={`mt-4 text-sm border-t border-gray-600 pt-3 ${
                    isDarkMode ? "text-gray-300" : "text-gray-800"
                  }`}
                >
                  {note.message}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
