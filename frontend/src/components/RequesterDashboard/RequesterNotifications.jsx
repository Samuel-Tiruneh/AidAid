import React, { useState } from "react";
import { FiBell, FiGift, FiMail, FiAlertCircle, FiAward } from "react-icons/fi";

const RequesterNotifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "donation",
      name: "Zerihun Brihanu",
      amount: 100,
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      type: "platform",
      message: "Your request has been featured",
      time: "5 hours ago",
      read: true,
    },
    {
      id: 3,
      type: "verification",
      message: "Documents verified",
      time: "1 day ago",
      read: true,
    },
    {
      id: 4,
      type: "message",
      content: "New message from supporter",
      time: "2 days ago",
      read: false,
    },
  ]);

  const [sortBy, setSortBy] = useState("recent");
  const [filterBy, setFilterBy] = useState("all");

  const sortedNotifications = [...notifications].sort((a, b) => {
    if (sortBy === "recent") return new Date(b.time) - new Date(a.time);
    return 0;
  });

  const filteredNotifications =
    filterBy === "all"
      ? sortedNotifications
      : sortedNotifications.filter((n) => n.type === filterBy);

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <FiBell className="mr-2 text-pink-500" />
          Notifications
        </h2>

        <div className="flex space-x-3">
          <select
            className="p-2 rounded-md border border-gray-300 text-sm"
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
          >
            <option value="all">All Notifications</option>
            <option value="donation">Donations</option>
            <option value="platform">Platform</option>
            <option value="verification">Verification</option>
            <option value="message">Messages</option>
          </select>

          <select
            className="p-2 rounded-md border border-gray-300 text-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="recent">Most Recent</option>
            <option value="unread">Unread First</option>
          </select>
        </div>
      </div>

      <ul className="space-y-3">
        {filteredNotifications.map((notification) => (
          <li
            key={notification.id}
            className={`p-4 rounded-lg border ${
              notification.read
                ? "bg-gray-50 border-gray-100"
                : "bg-pink-50 border-pink-100"
            }`}
            onClick={() => markAsRead(notification.id)}
          >
            <div className="flex items-start">
              {notification.type === "donation" && (
                <div className="bg-pink-100 p-2 rounded-full mr-3">
                  <FiGift className="text-pink-500" />
                </div>
              )}
              {notification.type === "platform" && (
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <FiAlertCircle className="text-blue-500" />
                </div>
              )}
              {notification.type === "verification" && (
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <FiAward className="text-green-500" />
                </div>
              )}
              {notification.type === "message" && (
                <div className="bg-purple-100 p-2 rounded-full mr-3">
                  <FiMail className="text-purple-500" />
                </div>
              )}

              <div className="flex-1">
                {notification.type === "donation" && (
                  <p className="text-sm">
                    <span className="font-medium">{notification.name}</span>{" "}
                    donated {notification.amount} ETB
                  </p>
                )}
                {(notification.type === "platform" ||
                  notification.type === "verification") && (
                  <p className="text-sm font-medium">{notification.message}</p>
                )}
                {notification.type === "message" && (
                  <p className="text-sm font-medium">{notification.content}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {notification.time}
                </p>
              </div>

              {!notification.read && (
                <div className="w-2 h-2 bg-pink-500 rounded-full ml-2"></div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RequesterNotifications;
