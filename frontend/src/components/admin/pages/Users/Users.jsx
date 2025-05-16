import React, { useEffect, useState, useContext } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaTimes,
  FaUser,
  FaUserShield,
  FaFilter,
  FaSort,
  FaExclamationTriangle,
} from "react-icons/fa";
import { ThemeContext } from "../../../../context/ThemeContext";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const Users = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showStatusConfirmation, setShowStatusConfirmation] = useState(false);
  const roleFilter = searchParams.get("role");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("username");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const navigate = useNavigate();

  const { isDarkMode } = useContext(ThemeContext);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        let url = "http://localhost:5000/api/users";
        if (roleFilter) url += `?role=${roleFilter}`;

        const response = await axios.get(url);
        const allUsers = Array.isArray(response.data) ? response.data : [];

        setUsers(allUsers.filter((user) => !user.isAdmin));
        setAdmins(allUsers.filter((user) => user.isAdmin));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [roleFilter]);

  const filteredUsers = users
    .filter(
      (user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "createdAt") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return a[sortBy]?.localeCompare(b[sortBy]);
    });

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getActiveTabTitle = () => {
    switch (roleFilter) {
      case "Donor":
        return "Donors";
      case "Requester":
        return "Requesters";
      case "Admin":
        return "Administrators";
      default:
        return "All Users";
    }
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleStatusToggleClick = () => {
    setShowStatusConfirmation(true);
  };

  const cancelStatusToggle = () => {
    setShowStatusConfirmation(false);
  };

  const handleToggleStatus = async () => {
    if (!selectedUser) return;

    try {
      setIsUpdatingStatus(true);
      const newStatus = selectedUser.status === 'active' ? 'ban' : 'active';
      
      const response = await axios.patch(
        `http://localhost:5000/api/users/${selectedUser._id}/status`,
        { status: newStatus }
      );

      // Update the user in the appropriate list
      if (selectedUser.isAdmin) {
        setAdmins(admins.map(admin => 
          admin._id === selectedUser._id ? response.data : admin
        ));
      } else {
        setUsers(users.map(user => 
          user._id === selectedUser._id ? response.data : user
        ));
      }

      setSelectedUser(response.data);
      setShowStatusConfirmation(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleRoleFilter = (role) => {
    if (role) {
      searchParams.set("role", role);
    } else {
      searchParams.delete("role");
    }
    setSearchParams(searchParams);
  };

  if (error) {
    return (
      <div className={`p-4 ${isDarkMode ? "bg-gray-900" : "bg-gray-100"}`}>
        <div className="text-red-500 text-center">{error}</div>
      </div>
    );
  }

  return (
    <div
      className={`p-6 min-h-screen transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-pink-500 bg-clip-text text-transparent">
              User Management
            </h1>
            <p className="text-sm opacity-75 mt-1">
              Manage all platform users and administrators
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 min-w-[200px]">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                className={`w-full pl-10 pr-4 py-2 rounded-lg shadow-sm outline-none border focus:ring-2 transition-all ${
                  isDarkMode
                    ? "bg-gray-800 text-white border-gray-600 focus:ring-pink-500 focus:border-pink-500"
                    : "bg-white text-black border-gray-300 focus:ring-pink-500 focus:border-pink-500"
                }`}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Link
              to={
                roleFilter === "Admin"
                  ? "/admin/users/add_admin"
                  : "/admin/users/add_user"
              }
              className="bg-gradient-to-r from-pink-600 to-pink-600 hover:from-pink-700 hover:to-pin-700 text-white px-5 py-2 rounded-lg shadow transition flex items-center gap-2 whitespace-nowrap"
            >
              <span>+ Add</span>
              <span>{roleFilter === "Admin" ? "Admin" : "User"}</span>
            </Link>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleRoleFilter(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                !roleFilter
                  ? isDarkMode
                    ? "bg-pink-600 text-white"
                    : "bg-pink-100 text-pink-700"
                  : isDarkMode
                  ? "bg-gray-800 hover:bg-gray-700"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <FaUser /> All Users
            </button>
            <button
              onClick={() => handleRoleFilter("Donor")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                roleFilter === "Donor"
                  ? isDarkMode
                    ? "bg-blue-600 text-white"
                    : "bg-blue-100 text-blue-700"
                  : isDarkMode
                  ? "bg-gray-800 hover:bg-gray-700"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <FaUser /> Donors
            </button>
            <button
              onClick={() => handleRoleFilter("Requester")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                roleFilter === "Requester"
                  ? isDarkMode
                    ? "bg-green-600 text-white"
                    : "bg-green-100 text-green-700"
                  : isDarkMode
                  ? "bg-gray-800 hover:bg-gray-700"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <FaUser /> Requesters
            </button>
            <button
              onClick={() => handleRoleFilter("Admin")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                roleFilter === "Admin"
                  ? isDarkMode
                    ? "bg-purple-600 text-white"
                    : "bg-purple-100 text-purple-700"
                  : isDarkMode
                  ? "bg-gray-800 hover:bg-gray-700"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <FaUserShield /> Admins
            </button>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {getActiveTabTitle()}{" "}
            <span className="text-sm opacity-70">
              (
              {(roleFilter === "Admin"
                ? filteredAdmins.length
                : filteredUsers.length) +
                (roleFilter ? 0 : filteredAdmins.length)}{" "}
              total)
            </span>
          </h2>

          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                isDarkMode ? "bg-gray-800" : "bg-gray-100"
              }`}
            >
              <FaSort className="opacity-70" />
              <select
                className={`bg-transparent outline-none text-sm ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="username">Sort by Name</option>
                <option value="createdAt">Sort by Date</option>
              </select>
            </div>
          </div>
        </div>

        {/* User List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
          </div>
        ) : (
          <div
            className={`rounded-xl shadow-lg overflow-hidden transition ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            {filteredUsers.length > 0 || filteredAdmins.length > 0 ? (
              <ul className="divide-y divide-gray-700">
                <AnimatePresence>
                  {(!roleFilter || roleFilter !== "Admin") &&
                    filteredUsers.map((user) => (
                      <motion.li
                        key={user._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <UserListItem
                          user={user}
                          isDarkMode={isDarkMode}
                          onViewClick={() => handleViewDetails(user)}
                        />
                      </motion.li>
                    ))}

                  {(!roleFilter || roleFilter === "Admin") &&
                    filteredAdmins.map((admin) => (
                      <motion.li
                        key={admin._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <UserListItem
                          user={admin}
                          isDarkMode={isDarkMode}
                          onViewClick={() => handleViewDetails(admin)}
                          isAdmin={true}
                        />
                      </motion.li>
                    ))}
                </AnimatePresence>
              </ul>
            ) : (
              <div className="p-10 text-center">
                <div className="inline-block p-4 rounded-full bg-gray-200 dark:bg-gray-700 mb-4">
                  <FaUser className="text-3xl text-gray-400" />
                </div>
                <h3 className="text-xl font-medium mb-2">No users found</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {searchTerm
                    ? `No users match your search for "${searchTerm}"`
                    : "There are currently no users in this category"}
                </p>
              </div>
            )}
          </div>
        )}

        {/* User Details Modal */}
        <AnimatePresence>
          {showModal && selectedUser && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
                isDarkMode ? "bg-black/70" : "bg-black/50"
              }`}
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className={`relative rounded-xl shadow-2xl w-full max-w-2xl p-6 ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <button
                  onClick={closeModal}
                  className={`absolute top-4 right-4 p-2 rounded-full ${
                    isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
                  } transition`}
                >
                  <FaTimes className="text-xl" />
                </button>

                <div className="flex items-start gap-4 mb-6">
                  <div
                    className={`p-3 rounded-full ${
                      selectedUser.isAdmin
                        ? "bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-300"
                        : "bg-pink-100 text-pink-600 dark:bg-pink-900/50 dark:text-pink-300"
                    }`}
                  >
                    {selectedUser.isAdmin ? (
                      <FaUserShield className="text-2xl" />
                    ) : (
                      <FaUser className="text-2xl" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      {selectedUser.username}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`px-2 py-1 text-xs rounded-full capitalize ${
                          selectedUser.isAdmin
                            ? "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200"
                        }`}
                      >
                        {selectedUser.role}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          selectedUser.status === 'active'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200'
                        }`}
                      >
                        {selectedUser.status}
                      </span>
                      {selectedUser.isAdmin && (
                        <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200">
                          Administrator
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <DetailItem
                    label="ID"
                    value={selectedUser._id}
                    isDarkMode={isDarkMode}
                  />
                  <DetailItem
                    label="Email"
                    value={selectedUser.email}
                    isDarkMode={isDarkMode}
                  />
                  <DetailItem
                    label="Phone"
                    value={selectedUser.phoneNumber || "Not provided"}
                    isDarkMode={isDarkMode}
                  />
                  <DetailItem
                    label="Location"
                    value={selectedUser.location || "Not provided"}
                    isDarkMode={isDarkMode}
                  />
                  <DetailItem
                    label="Created At"
                    value={new Date(selectedUser.createdAt).toLocaleString()}
                    isDarkMode={isDarkMode}
                  />
                  <DetailItem
                    label="Updated At"
                    value={new Date(selectedUser.updatedAt).toLocaleString()}
                    isDarkMode={isDarkMode}
                  />
                </div>

                <div className="mt-6 flex flex-wrap justify-end gap-3">
                  <button
                    onClick={closeModal}
                    className={`px-4 py-2 rounded-lg ${
                      isDarkMode
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-gray-200 hover:bg-gray-300"
                    } transition`}
                  >
                    Close
                  </button>
                  <button
                    onClick={handleStatusToggleClick}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                      selectedUser.status === 'active' 
                        ? 'bg-yellow-600 hover:bg-yellow-700' 
                        : 'bg-green-600 hover:bg-green-700'
                    } text-white transition`}
                  >
                    <FaExclamationTriangle /> 
                    {selectedUser.status === 'active' ? 'Ban' : 'Activate'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status Toggle Confirmation Modal */}
        <AnimatePresence>
          {showStatusConfirmation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
                isDarkMode ? "bg-black/70" : "bg-black/50"
              }`}
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className={`relative rounded-xl shadow-2xl w-full max-w-md p-6 ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <div className="text-center">
                  <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${
                    selectedUser?.status === 'active' 
                      ? 'bg-yellow-100 dark:bg-yellow-900/50' 
                      : 'bg-green-100 dark:bg-green-900/50'
                  } mb-4`}>
                    <FaExclamationTriangle className={`h-6 w-6 ${
                      selectedUser?.status === 'active' 
                        ? 'text-yellow-600 dark:text-yellow-300' 
                        : 'text-green-600 dark:text-green-300'
                    }`} />
                  </div>
                  <h3 className="text-lg font-medium mb-2">
                    {selectedUser?.status === 'active' ? 'Ban User' : 'Activate User'}
                  </h3>
                  <div className="mt-2">
                    <p className={`text-sm ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}>
                      Are you sure you want to {selectedUser?.status === 'active' ? 'ban' : 'activate'} {selectedUser?.username}?
                    </p>
                    <p className={`text-xs mt-1 ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}>
                      {selectedUser?.status === 'active' 
                        ? 'This will prevent the user from accessing the platform.'
                        : 'This will restore full access to the platform.'}
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex justify-center gap-3">
                  <button
                    onClick={cancelStatusToggle}
                    className={`px-4 py-2 rounded-lg ${
                      isDarkMode
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-gray-200 hover:bg-gray-300"
                    } transition`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleToggleStatus}
                    disabled={isUpdatingStatus}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                      isUpdatingStatus 
                        ? "bg-gray-500" 
                        : selectedUser?.status === 'active' 
                          ? "bg-yellow-600 hover:bg-yellow-700" 
                          : "bg-green-600 hover:bg-green-700"
                    } text-white transition`}
                  >
                    {isUpdatingStatus 
                      ? "Processing..." 
                      : selectedUser?.status === 'active' 
                        ? "Confirm Ban" 
                        : "Confirm Activation"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const UserListItem = ({ user, isDarkMode, onViewClick, isAdmin }) => (
  <li
    className={`p-4 transition hover:bg-opacity-50 ${
      isDarkMode
        ? "hover:bg-gray-700 bg-gray-800"
        : "hover:bg-gray-100 bg-white"
    }`}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div
          className={`p-2 rounded-full ${
            isAdmin
              ? "bg-purple-100 text-purple-600 dark:bg-purple-900/50"
              : "bg-pink-100 text-pink-600 dark:bg-pink-900/50"
          }`}
        >
          {isAdmin ? <FaUserShield /> : <FaUser />}
        </div>
        <div>
          <p className="font-semibold flex items-center gap-2">
            {user.username}
          </p>
          <p className="text-sm opacity-75">{user.email}</p>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                isDarkMode ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              {user.role}
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                user.status === 'active'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200'
              }`}
            >
              {user.status}
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                isDarkMode ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              Joined: {new Date(user.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onViewClick}
        className="bg-gradient-to-r from-pink-500 to-pink-500 hover:from-pink-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg text-sm transition shadow"
      >
        View Details
      </motion.button>
    </div>
  </li>
);

const DetailItem = ({ label, value, isDarkMode }) => (
  <div className="flex flex-col space-y-1">
    <span
      className={`text-xs font-medium ${
        isDarkMode ? "text-gray-400" : "text-gray-500"
      }`}
    >
      {label}:
    </span>
    <p
      className={`px-3 py-2 rounded-lg ${
        isDarkMode ? "bg-gray-700" : "bg-gray-100"
      }`}
    >
      {value}
    </p>
  </div>
);

export default Users;