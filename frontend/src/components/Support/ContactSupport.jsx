import React, { useContext } from "react";
import { FiMail, FiPhone, FiMessageSquare, FiMapPin } from "react-icons/fi"; // Importing icons
import contactSupportImg from "../../assets/SupportAssets/contact-mail.png";
import { ThemeContext } from "../../context/ThemeContext"; // Import ThemeContext

const ContactSupport = () => {
  const { isDarkMode } = useContext(ThemeContext); // Use theme context

  return (
    <div className={`p-8 mt-4 md:mr-8 rounded-2xl shadow-lg ${
      isDarkMode ? "bg-gray-800" : "bg-white"
    }`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center gap-4 justify-center">
        <img
          src={contactSupportImg}
          alt="contact support"
          className="w-10 md:w-12 h-auto max-w-full"
        />
        <h2 className={`text-2xl sm:text-3xl font-bold mt-4 sm:mt-0 ${
          isDarkMode ? "text-pink-400" : "text-pink-600"
        }`}>
          Contact Support
        </h2>
      </div>

      {/* Contact Details */}
      <div className="mt-6 max-w-6xl mx-auto px-8">
        <p className={`text-lg sm:text-xl font-semibold text-center sm:text-left ${
          isDarkMode ? "text-gray-300" : "text-slate-700"
        }`}>
          If you need any help or have further questions, feel free to reach out. 
          Our support team is available through the contact options below.
        </p>
        
        <ul className="mt-6 space-y-5">
          <li className="flex flex-col sm:flex-row items-center sm:items-start gap-2">
            <FiMail className="text-pink-500 text-2xl" />
            <span>
              <span className={`font-semibold ${
                isDarkMode ? "text-gray-200" : "text-gray-600"
              }`}>Email:</span> 
              <a
                href="mailto:support@adeyaid.com"
                className="text-pink-600 hover:underline ml-1"
              >
                support@adeyaid.com
              </a>
            </span>
          </li>
          <li className="flex flex-col sm:flex-row items-center sm:items-start gap-2">
            <FiPhone className="text-pink-500 text-2xl" />
            <span className={`text-center ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}>
              <span className="font-semibold">Phone:</span> +251-935749521/+251-932790411/+251-926045509
            </span>
          </li>
          <li className="flex flex-col sm:flex-row items-center sm:items-start gap-2">
            <FiMessageSquare className="text-pink-500 text-2xl" />
            <span className={`text-center ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}>
              <span className="font-semibold">Live Chat:</span> Available on the website (during working hours)
            </span>
          </li>
          <li className="flex flex-col sm:flex-row items-center sm:items-start gap-2">
            <FiMapPin className="text-pink-500 text-2xl" />
            <span className={`${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}>
              <span className="font-semibold">Address:</span> Bahir Dar, Ethiopia
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ContactSupport;
