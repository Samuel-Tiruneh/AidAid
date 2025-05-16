import React, { useState, useEffect, useContext } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { List, Avatar, Badge, notification as antdNotification } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { ThemeContext } from "../../context/ThemeContext"; // Adjust path as needed

const Notification = ({ userId }) => {
  const { isDarkMode } = useContext(ThemeContext);

  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/notifications?userId=${userId}`
        );
        setNotifications(res.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();

    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    newSocket.on("new-notification", (notification) => {
      if (notification.userId === userId) {
        setNotifications((prev) => [notification, ...prev]);

        // Show appropriate notification style
        if (notification.type === "profile_update") {
          antdNotification.success({
            message: "Profile Updated",
            description: notification.message,
            placement: "bottomRight",
            style: {
              backgroundColor: isDarkMode ? "#1f2937" : undefined, // Dark gray bg in dark mode
              color: isDarkMode ? "#d1d5db" : undefined, // Light gray text in dark mode
            },
          });
        } else if (notification.type === "password_change") {
          antdNotification.info({
            message: "Security Update",
            description: notification.message,
            placement: "bottomRight",
            style: {
              backgroundColor: isDarkMode ? "#1f2937" : undefined,
              color: isDarkMode ? "#d1d5db" : undefined,
            },
          });
        }
      }
    });

    return () => newSocket.disconnect();
  }, [userId, isDarkMode]);

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "0 auto",
        backgroundColor: isDarkMode ? "#111827" : "#fff", // Tailwind bg-gray-900 / white
        color: isDarkMode ? "#f9fafb" : "#111827", // Tailwind text-gray-50 / text-gray-900
        borderRadius: 8,
        padding: 16,
        boxShadow: isDarkMode
          ? "0 4px 6px rgba(0, 0, 0, 0.9)"
          : "0 4px 6px rgba(0, 0, 0, 0.1)",
        transition: "background-color 0.3s, color 0.3s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
        <BellOutlined
          style={{
            fontSize: 24,
            marginRight: 8,
            color: isDarkMode ? "#f9fafb" : "#111827",
          }}
        />
        <h2 style={{ margin: 0 }}>Notifications</h2>
        {notifications.length > 0 && (
          <Badge count={notifications.length} style={{ marginLeft: 10 }} />
        )}
      </div>

      <List
        dataSource={notifications}
        renderItem={(item) => (
          <List.Item
            style={{
              backgroundColor: isDarkMode ? "#1f2937" : "#f9fafb", // bg-gray-800 / bg-gray-50
              borderRadius: 6,
              marginBottom: 8,
              transition: "background-color 0.3s",
            }}
          >
            <List.Item.Meta
              avatar={
                <Avatar
                  icon={<BellOutlined />}
                  style={{
                    backgroundColor: isDarkMode ? "#374151" : "#e5e7eb",
                    color: isDarkMode ? "#f9fafb" : "#374151",
                  }}
                />
              }
              title={
                <span style={{ color: isDarkMode ? "#f9fafb" : "#111827" }}>
                  {item.message}
                </span>
              }
              description={
                <span style={{ color: isDarkMode ? "#d1d5db" : "#6b7280" }}>
                  {new Date(item.createdAt).toLocaleString()}
                </span>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default Notification;
