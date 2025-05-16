import React from "react";
import { LogOut, Sun } from "lucide-react";
import { useAuth } from "../../components/Authentication/AuthContext";
import profilePlaceholder from "../../assets/images/profile.jpg";

const RequesterNavbar = () => {
  const { user, logout } = useAuth();

  return (
    <div className="flex justify-end items-center bg-white shadow px-6 py-4">
      <div className="flex items-center space-x-4">
        <img
          src={user?.profilePic || profilePlaceholder}
          alt="Profile"
          className="h-10 w-10 rounded-full"
        />
        <div className="text-sm">
          <p className="font-semibold">{user?.username || "User"}</p>
          <div className="flex space-x-3 mt-1 text-gray-500">
            <button
              onClick={logout}
              className="flex items-center hover:text-red-500"
            >
              <LogOut size={16} className="mr-1" />
              Logout
            </button>
            <button className="hover:text-yellow-500">
              <Sun size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequesterNavbar;
