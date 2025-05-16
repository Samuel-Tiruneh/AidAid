import React, { useState, useContext, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../components/Authentication/AuthContext";
import {
  FaUser,
  FaSignInAlt,
  FaHeart,
  FaBars,
  FaTimes,
  FaSun,
  FaMoon,
  FaChevronDown,
  FaUserCircle,
  FaSignOutAlt,
  FaTachometerAlt, // Dashboard icon
} from "react-icons/fa";
import donationimage from "../assets/images/logo.png";
import profilePlaceholder from "../assets/images/profile.jpg";
import ProfileSidePopup from "./ProfileSidePopup";
import { ThemeContext } from "../context/ThemeContext";

const Header = ({ openPopup }) => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSidePopupOpen, setIsSidePopupOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const dropdownRef = useRef(null);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const handleLogout = () => logout();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Hide header and footer on dashboard pages
  const dashboardPaths = ["/requester-dashboard", "/admin", "/donor-dashboard"];
  const isDashboardRoute = dashboardPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  // Determine dashboard route based on user role
  const getDashboardRoute = () => {
    console.log("Current user:", user); // Debug log
    console.log("User role:", user?.role); // Debug log
    return user?.role === "Requester"
      ? "/requester-dashboard"
      : user?.role === "Donor"
      ? "/donor-dashboard"
      : "/admin";
  };

  return (
    <header
      className={`${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-700"
      } shadow-md sticky top-0 z-50 w-full font-[Poppins]`}
    >
      <nav className="container mx-auto flex justify-between items-center py-3 px-6 lg:px-12">
        <NavLink
          to="/"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center"
        >
          {!isDashboardRoute && (
            <div className="h-16 w-16 ml-3 flex items-center justify-center rounded-full overflow-hidden bg-white p-1 border border-1 border-gray-300">
              <img
                src={donationimage}
                alt="Logo"
                className="h-auto w-auto max-h-[90%] max-w-[90%] object-scale-down"
                loading="lazy"
              />
            </div>
          )}
        </NavLink>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center space-x-6 font-bold text-lg">
          {[
            { to: "/", label: "Home" },
            {
              to: "/donate-page",
              label: "Donate",
              icon: <FaHeart className="text-red-500" />,
            },
            { to: "/request", label: "Request" },
            { to: "/impact", label: "About Us" },
            { to: "/support", label: "Support" },
          ].map(({ to, label, icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-1 transition duration-300 ${
                    isActive ? "text-pink-500 font-bold" : "hover:text-pink-500"
                  }`
                }
              >
                {icon} {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right Side (Theme, Auth) */}
        <div className="hidden md:flex items-center space-x-6">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 text-lg transition duration-300 hover:text-pink-500"
          >
            {isDarkMode ? (
              <FaSun className="text-xl text-yellow-500" />
            ) : (
              <FaMoon className="text-xl" />
            )}
          </button>

          {/* Authentication */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2"
              >
 <img
  src={user?.profilePicture || profilePlaceholder}
  alt="Profile"
  className="h-10 w-10 rounded-full object-cover"
  key={user?.profilePicture} // This forces re-render when image changes
/>

                <span>{user.username}</span>
                <FaChevronDown />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg transition-opacity duration-200 z-50">
                  <ul className="py-2">
                    <li>
                      <NavLink
                        to={getDashboardRoute()}
                        className="block w-full px-4 py-2 text-gray-700 text-left hover:bg-blue-500 hover:text-white transition-all duration-150 rounded"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <FaTachometerAlt className="mr-2" /> Dashboard
                      </NavLink>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsDropdownOpen(false);
                        }}
                        className="block w-full px-4 py-2 text-gray-700 text-left hover:bg-red-500 hover:text-white transition-all duration-150 rounded"
                      >
                        <FaSignOutAlt className="mr-2" /> Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={() => openPopup("login")}
                className="flex items-center gap-1 text-lg transition duration-300 hover:text-pink-500"
              >
                <FaSignInAlt className="text-2xl" /> Login
              </button>
              <button
                onClick={() => openPopup("register")}
                className="bg-pink-500 text-white px-4 py-2 rounded-lg flex items-center gap-1 font-medium hover:bg-pink-600 transition duration-300"
              >
                <FaUser className="text-2xl" /> Signup
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-3xl focus:outline-none"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </nav>

      {/* Mobile Navigation Menu */}
      {menuOpen && (
        <div
          className={`md:hidden absolute top-16 left-0 w-full ${
            isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-700"
          } shadow-md transition-transform`}
        >
          <ul className="flex flex-col space-y-4 p-6 font-bold text-lg">
            {/* Theme Toggle */}
            <li>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 transition duration-300 hover:text-pink-500"
              >
                {isDarkMode ? (
                  <FaSun className="text-xl text-yellow-500" />
                ) : (
                  <FaMoon className="text-xl" />
                )}
                {isDarkMode ? "Light Mode" : "Dark Mode"}
              </button>
            </li>

            {/* Other Menu Items */}
            {[
              { to: "/", label: "Home" },
              {
                to: "/donate-page",
                label: "Donate",
                icon: <FaHeart className="text-red-500" />,
              },
              { to: "/request", label: "Request" },
              { to: "/impact", label: "About Us" },
              { to: "/support", label: "Support" },
            ].map(({ to, label, icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className="flex items-center gap-1 transition duration-300 hover:text-pink-500"
                  onClick={toggleMenu}
                >
                  {icon} {label}
                </NavLink>
              </li>
            ))}

            {/* Authentication */}
            {user ? (
              <>
                <li>
                  <NavLink
                    to={getDashboardRoute()}
                    className="flex items-center gap-1 transition duration-300 hover:text-pink-500"
                    onClick={toggleMenu}
                  >
                    <FaTachometerAlt className="mr-2" /> Dashboard
                  </NavLink>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-gray-700 text-left hover:bg-red-500 hover:text-white transition-all duration-150 rounded"
                  >
                    <FaSignOutAlt className="mr-2" /> Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <button
                    onClick={() => {
                      openPopup("login");
                      toggleMenu();
                    }}
                    className="flex items-center gap-1 text-lg transition duration-300 hover:text-pink-500"
                  >
                    <FaSignInAlt className="text-2xl" /> Login
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      openPopup("register");
                      toggleMenu();
                    }}
                    className="bg-pink-500 text-white px-3 py-1 rounded-md flex items-center gap-1 font-medium text-base hover:bg-pink-600 transition duration-300 w-fit mx-auto"
                  >
                    <FaUser className="text-lg" /> Signup
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      )}

      {/* Profile Side Popup */}
      {isSidePopupOpen && (
        <ProfileSidePopup user={user} setIsSidePopupOpen={setIsSidePopupOpen} />
      )}
    </header>
  );
};

export default Header;


// import React, { useState, useContext, useRef, useEffect } from "react";
// import { NavLink } from "react-router-dom";
// import { useAuth } from "../components/Authentication/AuthContext";
// import {
//   FaUser,
//   FaSignInAlt,
//   FaHeart,
//   FaBars,
//   FaTimes,
//   FaSun,
//   FaMoon,
//   FaChevronDown,
//   FaUserCircle,
//   FaSignOutAlt,
//   FaTachometerAlt, // Dashboard icon
// } from "react-icons/fa";
// import donationimage from "../assets/images/logo.png";
// import profilePlaceholder from "../assets/images/profile.jpg";
// import ProfileSidePopup from "./ProfileSidePopup";
// import { ThemeContext } from "../context/ThemeContext";

// const Header = ({ openPopup }) => {
//   const { user, logout } = useAuth();
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [isSidePopupOpen, setIsSidePopupOpen] = useState(false);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const { isDarkMode, toggleTheme } = useContext(ThemeContext);
//   const dropdownRef = useRef(null);

//   const toggleMenu = () => setMenuOpen(!menuOpen);
//   const handleLogout = () => logout();

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsDropdownOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   // Hide header and footer on dashboard pages
//   const dashboardPaths = ["/requester-dashboard", "/admin", "/donor-dashboard"];
//   const isDashboardRoute = dashboardPaths.some((path) =>
//     location.pathname.startsWith(path)
//   );

//   // Determine dashboard route based on user role
//   const getDashboardRoute = () => {
//     console.log("Current user:", user); // Debug log
//     console.log("User role:", user?.role); // Debug log
//     return user?.role === "Requester"
//       ? "/requester-dashboard"
//       : user?.role === "Donor"
//       ? "/donor-dashboard"
//       : "/admin";
//   };

//   return (
//     <header
//       className={`${
//         isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-700"
//       } shadow-md sticky top-0 z-50 w-full font-[Poppins]`}
//     >
//       <nav className="container mx-auto flex justify-between items-center py-3 px-6 lg:px-12">
//         <NavLink
//           to="/"
//           onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
//           className="flex items-center"
//         >
//           {!isDashboardRoute && (
//             <div className="h-16 w-16 ml-3 flex items-center justify-center rounded-full overflow-hidden bg-white p-1 border border-1 border-gray-300">
//               <img
//                 src={donationimage}
//                 alt="Logo"
//                 className="h-auto w-auto max-h-[90%] max-w-[90%] object-scale-down"
//                 loading="lazy"
//               />
//             </div>
//           )}
//         </NavLink>

//         {/* Desktop Navigation */}
//         <ul className="hidden md:flex items-center space-x-6 font-bold text-lg">
//           {[
//             { to: "/", label: "Home" },
//             {
//               to: "/donate-page",
//               label: "Donate",
//               icon: <FaHeart className="text-red-500" />,
//             },
//             { to: "/request", label: "Request" },
//             { to: "/impact", label: "About Us" },
//             { to: "/support", label: "Support" },
//           ].map(({ to, label, icon }) => (
//             <li key={to}>
//               <NavLink
//                 to={to}
//                 className={({ isActive }) =>
//                   `flex items-center gap-1 transition duration-300 ${
//                     isActive ? "text-pink-500 font-bold" : "hover:text-pink-500"
//                   }`
//                 }
//               >
//                 {icon} {label}
//               </NavLink>
//             </li>
//           ))}
//         </ul>

//         {/* Right Side (Theme, Auth) */}
//         <div className="hidden md:flex items-center space-x-6">
//           {/* Theme Toggle */}
//           <button
//             onClick={toggleTheme}
//             className="flex items-center gap-2 text-lg transition duration-300 hover:text-pink-500"
//           >
//             {isDarkMode ? (
//               <FaSun className="text-xl text-yellow-500" />
//             ) : (
//               <FaMoon className="text-xl" />
//             )}
//           </button>

//           {/* Authentication */}
//           {user ? (
//             <div className="relative" ref={dropdownRef}>
//               <button
//                 onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                 className="flex items-center gap-2"
//               >
//                 <img
//                   src={user.profilePicture || profilePlaceholder}
//                   alt="Profile"
//                   className="w-10 h-10 rounded-full border border-pink-300"
//                 />
//                 <span>{user.username}</span>
//                 <FaChevronDown />
//               </button>
//               {isDropdownOpen && (
//                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg transition-opacity duration-200 z-50">
//                   <ul className="py-2">
//                     <li>
//                       <NavLink
//                         to={getDashboardRoute()}
//                         className="block w-full px-4 py-2 text-gray-700 text-left hover:bg-blue-500 hover:text-white transition-all duration-150 rounded"
//                         onClick={() => setIsDropdownOpen(false)}
//                       >
//                         <FaTachometerAlt className="mr-2" /> Dashboard
//                       </NavLink>
//                     </li>
//                     <li>
//                       <button
//                         onClick={() => {
//                           handleLogout();
//                           setIsDropdownOpen(false);
//                         }}
//                         className="block w-full px-4 py-2 text-gray-700 text-left hover:bg-red-500 hover:text-white transition-all duration-150 rounded"
//                       >
//                         <FaSignOutAlt className="mr-2" /> Logout
//                       </button>
//                     </li>
//                   </ul>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <>
//               <button
//                 onClick={() => openPopup("login")}
//                 className="flex items-center gap-1 text-lg transition duration-300 hover:text-pink-500"
//               >
//                 <FaSignInAlt className="text-2xl" /> Login
//               </button>
//               <button
//                 onClick={() => openPopup("register")}
//                 className="bg-pink-500 text-white px-4 py-2 rounded-lg flex items-center gap-1 font-medium hover:bg-pink-600 transition duration-300"
//               >
//                 <FaUser className="text-2xl" /> Signup
//               </button>
//             </>
//           )}
//         </div>

//         {/* Mobile Menu Button */}
//         <button
//           onClick={toggleMenu}
//           className="md:hidden text-3xl focus:outline-none"
//         >
//           {menuOpen ? <FaTimes /> : <FaBars />}
//         </button>
//       </nav>

//       {/* Mobile Navigation Menu */}
//       {menuOpen && (
//         <div
//           className={`md:hidden absolute top-16 left-0 w-full ${
//             isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-700"
//           } shadow-md transition-transform`}
//         >
//           <ul className="flex flex-col space-y-4 p-6 font-bold text-lg">
//             {/* Theme Toggle */}
//             <li>
//               <button
//                 onClick={toggleTheme}
//                 className="flex items-center gap-2 transition duration-300 hover:text-pink-500"
//               >
//                 {isDarkMode ? (
//                   <FaSun className="text-xl text-yellow-500" />
//                 ) : (
//                   <FaMoon className="text-xl" />
//                 )}
//                 {isDarkMode ? "Light Mode" : "Dark Mode"}
//               </button>
//             </li>

//             {/* Other Menu Items */}
//             {[
//               { to: "/", label: "Home" },
//               {
//                 to: "/donate-page",
//                 label: "Donate",
//                 icon: <FaHeart className="text-red-500" />,
//               },
//               { to: "/request", label: "Request" },
//               { to: "/impact", label: "About Us" },
//               { to: "/support", label: "Support" },
//             ].map(({ to, label, icon }) => (
//               <li key={to}>
//                 <NavLink
//                   to={to}
//                   className="flex items-center gap-1 transition duration-300 hover:text-pink-500"
//                   onClick={toggleMenu}
//                 >
//                   {icon} {label}
//                 </NavLink>
//               </li>
//             ))}

//             {/* Authentication */}
//             {user ? (
//               <>
//                 <li>
//                   <NavLink
//                     to={getDashboardRoute()}
//                     className="flex items-center gap-1 transition duration-300 hover:text-pink-500"
//                     onClick={toggleMenu}
//                   >
//                     <FaTachometerAlt className="mr-2" /> Dashboard
//                   </NavLink>
//                 </li>
//                 <li>
//                   <button
//                     onClick={handleLogout}
//                     className="block w-full px-4 py-2 text-gray-700 text-left hover:bg-red-500 hover:text-white transition-all duration-150 rounded"
//                   >
//                     <FaSignOutAlt className="mr-2" /> Logout
//                   </button>
//                 </li>
//               </>
//             ) : (
//               <>
//                 <li>
//                   <button
//                     onClick={() => {
//                       openPopup("login");
//                       toggleMenu();
//                     }}
//                     className="flex items-center gap-1 text-lg transition duration-300 hover:text-pink-500"
//                   >
//                     <FaSignInAlt className="text-2xl" /> Login
//                   </button>
//                 </li>
//                 <li>
//                   <button
//                     onClick={() => {
//                       openPopup("register");
//                       toggleMenu();
//                     }}
//                     className="bg-pink-500 text-white px-3 py-1 rounded-md flex items-center gap-1 font-medium text-base hover:bg-pink-600 transition duration-300 w-fit mx-auto"
//                   >
//                     <FaUser className="text-lg" /> Signup
//                   </button>
//                 </li>
//               </>
//             )}
//           </ul>
//         </div>
//       )}

//       {/* Profile Side Popup */}
//       {isSidePopupOpen && (
//         <ProfileSidePopup user={user} setIsSidePopupOpen={setIsSidePopupOpen} />
//       )}
//     </header>
//   );
// };

// export default Header;