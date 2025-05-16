import React, { useState, useContext } from "react";
import { IoClose } from "react-icons/io5";
import Logo from "../../assets/images/logo.png";
import { useAuth } from "./AuthContext";
import { FcGoogle } from "react-icons/fc";
import { IoEye, IoEyeOff } from "react-icons/io5";
import Loader from "../../Loader";
import { ThemeContext } from "../../context/ThemeContext"; // Import ThemeContext

const Login = ({ isOpen, onClose, openPopup }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isDarkMode } = useContext(ThemeContext); // Use ThemeContext

  const { login } = useAuth();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(async () => {
      try {
        await login(formData.email, formData.password);
        onClose();
      } catch (error) {
        console.error("Login error:", error);
        alert("Login failed, please try again.");
      } finally {
        setIsLoading(false);
      }
    }, 3000);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
          } border-t-4 border-b-4 border-pink-400 rounded-lg p-6 w-full max-w-lg relative`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            className={`absolute top-4 right-4 ${
              isDarkMode ? "text-gray-300" : "text-gray-500"
            } hover:text-red-600 text-3xl`}
            onClick={onClose}
          >
            <IoClose />
          </button>

          {/* Logo */}
          <div className="flex justify-center items-center mb-6">
            <div
              className={`w-18 h-16 ${
                isDarkMode ? "" : ""
              }  flex items-center justify-center shadow-md`}
            >
              <img src={Logo} alt="Logo" className="h-14 w-16 rounded-md" />
            </div>
          </div>

          {/* Title and Subtitle */}
          <h2
            className={`text-4xl font-bold font-[poppins] text-center ${
              isDarkMode
                ? "bg-gradient-to-r from-pink-500 to-gray-300"
                : "bg-gradient-to-r from-pink-500 to-gray-500"
            } text-transparent bg-clip-text mb-2`}
          >
            Log In
          </h2>
          <p
            className={`text-center font-[poppins] ${
              isDarkMode
                ? "bg-gradient-to-r from-pink-500 to-gray-300"
                : "bg-gradient-to-r from-pink-500 to-gray-500"
            } text-transparent bg-clip-text mb-8`}
          >
            Welcome back! Please log in to continue.
          </p>

          {/* Google Login Button */}
          <button
            className={`w-full flex items-center justify-center gap-2 ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } py-3 border ${
              isDarkMode ? "border-gray-700" : "border-gray-300"
            } rounded-lg hover:${
              isDarkMode ? "bg-gray-700" : "bg-gray-100"
            } shadow-sm mb-6 transition duration-300`}
          >
            <FcGoogle className="text-2xl" />
            <span
              className={`font-medium ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Continue with Google
            </span>
          </button>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className={`w-full px-4 py-3 border ${
                  isDarkMode ? "border-gray-700" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none ${
                  isDarkMode
                    ? "bg-gray-500 text-white"
                    : "bg-white text-gray-700"
                }`}
                required
              />
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className={`w-full px-4 py-3 border ${
                  isDarkMode ? "border-gray-700" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none ${
                  isDarkMode
                    ? "bg-gray-500 text-white"
                    : "bg-white text-gray-700"
                }`}
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className={`absolute right-4 top-1/2 transform -translate-y-1/2 text-pink-500 hover:text-pink-600`}
              >
                {showPassword ? (
                  <IoEyeOff className="text-xl" />
                ) : (
                  <IoEye className="text-xl" />
                )}
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-pink-500 text-white text-xl font-[poppins] py-3 rounded-lg font-bold hover:bg-pink-600 transition duration-300"
            >
              Log In
            </button>
          </form>

          {/* Links */}
          <div className="flex justify-between mt-6 text-sm">
            <button
              onClick={() => openPopup("forgot-password")}
              className={`${
                isDarkMode ? "text-gray-300" : "text-gray-500"
              } hover:text-pink-500 font-[poppins]`}
            >
              Forgot Password?
            </button>
            <button
              onClick={() => openPopup("register")}
              className={`${
                isDarkMode ? "text-gray-300" : "text-gray-500"
              } hover:text-pink-500 font-[poppins]`}
            >
              Don’t have an account? <span className="font-bold">Register</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;


// import React, { useState, useContext } from "react";
// import { IoClose } from "react-icons/io5";
// import Logo from "../../assets/images/logo.png";
// import { useAuth } from "./AuthContext";
// import { FcGoogle } from "react-icons/fc";
// import { IoEye, IoEyeOff } from "react-icons/io5";
// import Loader from "../../Loader";
// import { ThemeContext } from "../../context/ThemeContext";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const Login = ({ isOpen, onClose, openPopup }) => {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const { isDarkMode } = useContext(ThemeContext);
//   const { login } = useAuth();

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   setIsLoading(true);

//   try {
//     const success = await login(formData.email, formData.password);
//     if (success) {
//       toast.success("Logged in successfully!");
//       onClose();
//     }
//   } catch (error) {
//     console.error("Login error:", error);
//     toast.error(error.message || "Login failed. Please check your credentials.");
//   } finally {
//     setIsLoading(false);
//   }
// };
//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   if (!isOpen) return null;

//   return (
//     <>
//       {isLoading && <Loader />}
//       <div
//         className={`fixed inset-0 font-[poppins] ${
//           isLoading ? "backdrop-blur-sm" : ""
//         } bg-opacity-30 flex items-center justify-center z-50`}
//         onClick={onClose}
//       >
//         <div
//           className={`${
//             isDarkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-700"
//           } border-t-4 border-b-4 border-pink-400 rounded-lg p-6 w-full max-w-lg relative`}
//           onClick={(e) => e.stopPropagation()}
//         >
//           {/* Close Button */}
//           <button
//             className={`absolute top-4 right-4 ${
//               isDarkMode ? "text-gray-300" : "text-gray-500"
//             } hover:text-red-600 text-3xl`}
//             onClick={onClose}
//           >
//             <IoClose />
//           </button>

//           {/* Logo */}
//           <div className="flex justify-center items-center mb-6">
//             <div className="w-18 h-16 flex items-center justify-center shadow-md">
//               <img src={Logo} alt="Logo" className="h-14 w-16 rounded-md" />
//             </div>
//           </div>

//           {/* Title */}
//           <h2
//             className={`text-4xl font-bold text-center bg-gradient-to-r from-pink-500 to-gray-500 text-transparent bg-clip-text mb-2`}
//           >
//             Log In
//           </h2>
//           <p className="text-center bg-gradient-to-r from-pink-500 to-gray-500 text-transparent bg-clip-text mb-8">
//             Welcome back! Please log in to continue.
//           </p>

//           {/* Google Login Button */}
//           <button
//             className={`w-full flex items-center justify-center gap-2 ${
//               isDarkMode ? "bg-gray-800" : "bg-white"
//             } py-3 border ${
//               isDarkMode ? "border-gray-700" : "border-gray-300"
//             } rounded-lg hover:${
//               isDarkMode ? "bg-gray-700" : "bg-gray-100"
//             } shadow-sm mb-6 transition duration-300`}
//           >
//             <FcGoogle className="text-2xl" />
//             <span
//               className={`font-medium ${
//                 isDarkMode ? "text-gray-300" : "text-gray-600"
//               }`}
//             >
//               Continue with Google
//             </span>
//           </button>

//           {/* Login Form */}
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <input
//                 type="email"
//                 name="email"
//                 id="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 placeholder="Email"
//                 className={`w-full px-4 py-3 border ${
//                   isDarkMode ? "border-gray-700" : "border-gray-300"
//                 } rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none ${
//                   isDarkMode ? "bg-gray-500 text-white" : "bg-white text-gray-700"
//                 }`}
//                 required
//               />
//             </div>
//             <div className="relative">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 name="password"
//                 id="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 placeholder="Password"
//                 className={`w-full px-4 py-3 border ${
//                   isDarkMode ? "border-gray-700" : "border-gray-300"
//                 } rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none ${
//                   isDarkMode ? "bg-gray-500 text-white" : "bg-white text-gray-700"
//                 }`}
//                 required
//               />
//               <button
//                 type="button"
//                 onClick={togglePasswordVisibility}
//                 className="absolute right-4 top-1/2 transform -translate-y-1/2 text-pink-500 hover:text-pink-600"
//               >
//                 {showPassword ? (
//                   <IoEyeOff className="text-xl" />
//                 ) : (
//                   <IoEye className="text-xl" />
//                 )}
//               </button>
//             </div>
//             <button
//               type="submit"
//               className="w-full bg-pink-500 text-white text-xl py-3 rounded-lg font-bold hover:bg-pink-600 transition duration-300"
//             >
//               Log In
//             </button>
//           </form>

//           {/* Links */}
//           <div className="flex justify-between mt-6 text-sm">
//             <button
//               onClick={() => openPopup("forgot-password")}
//               className={`${
//                 isDarkMode ? "text-gray-300" : "text-gray-500"
//               } hover:text-pink-500`}
//             >
//               Forgot Password?
//             </button>
//             <button
//               onClick={() => openPopup("register")}
//               className={`${
//                 isDarkMode ? "text-gray-300" : "text-gray-500"
//               } hover:text-pink-500`}
//             >
//               Don’t have an account? <span className="font-bold">Register</span>
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Login;


