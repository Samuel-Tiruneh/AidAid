import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaApple,
  FaGooglePlay,
  FaWindows,
  FaEnvelope,
  FaPhone,
  FaComments,
  FaQuestionCircle,
} from "react-icons/fa";
import donationimage from "../assets/images/logo.png";
import TermsOfServicePopup from "./Support/TermsOfServices";
import PrivacyPolicyPopup from "./Support/PrivacyPolicy";

const Footer = () => {
  const [popup, setPopup] = useState(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openPopup = (popupName) => setPopup(popupName);
  const closePopup = () => setPopup(null);

  return (
    <footer className="bg-gray-800 shadow-2xl text-white p-10 font-[poppins]">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
        {/* Logo Section */}
        <div>
          <button
            onClick={scrollToTop}
            className="flex items-center justify-center"
          >
            {/* Circle container (must be square for perfect roundness) */}
            <div className="h-16 w-16 rounded-full border-2 border-gray-300 overflow-hidden bg-gray-100 p-1">
              {/* Image container (ensures full visibility) */}
              <div className="w-full h-full flex items-center justify-center">
                <img
                  src={donationimage}
                  alt="Logo"
                  className="max-h-full max-w-full "
                />
              </div>
            </div>
          </button>
          <h2 className="text-2xl font-bold">Tsdey Aid Platform</h2>
          <p className="text-gray-300 italic text-sm mb-4">
            Empowering Change, One Donation at a Time.
          </p>
          <div className="flex justify-center md:justify-start space-x-5">
            <a
              href="#"
              className="text-white hover:text-gray-400 transition transform hover:scale-110"
            >
              <FaFacebook size={28} />
            </a>
            <a
              href="#"
              className="text-white hover:text-gray-400 transition transform hover:scale-110"
            >
              <FaInstagram size={28} />
            </a>
            <a
              href="#"
              className="text-white hover:text-gray-400 transition transform hover:scale-110"
            >
              <FaLinkedin size={28} />
            </a>
          </div>
        </div>

        {/* Company Section */}
        <div className="md:ml-10">
          <h3 className="text-lg font-semibold mb-3">Company</h3>
          <ul className="space-y-2 text-gray-400">
            <li>
              <NavLink
                to="/"
                onClick={scrollToTop}
                className="hover:underline hover:text-white transition"
              >
                Home
              </NavLink>
            </li>
            {[
              { name: "Donate", path: "/donate-page" },
              { name: "Request", path: "/request" },
              { name: "About Us", path: "/impact" },
              { name: "Support", path: "/support" },
            ].map(({ name, path }) => (
              <li key={name}>
                <NavLink
                  to={path}
                  onClick={scrollToTop}
                  className="hover:underline hover:text-white transition"
                >
                  {name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources Section */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Resources</h3>
          <ul className="space-y-2 text-gray-400">
            {[
              { name: "Donate Now", path: "/donate-page" },
              { name: "Our Impact", path: "/impact" },
              { name: "Get Involved", path: "/join" },
            ].map(({ name, path }) => (
              <li key={name}>
                <NavLink
                  to={path}
                  onClick={scrollToTop}
                  className="hover:underline hover:text-white transition"
                >
                  {name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Section */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact Us</h3>
          <ul className="space-y-2 text-gray-400">
            {[
              {
                icon: FaEnvelope,
                text: "tsedeydonation@gmail.com",
                link: "mailto:tsedeydonation@gmail.com",
              },
              {
                icon: FaPhone,
                text: "+ (251) 9456-7890",
                link: "tel:+25194567890",
              },
              { icon: FaComments, text: "Live Chat", link: "/live-chat" },
              { icon: FaQuestionCircle, text: "FAQs", link: "/faqs" },
            ].map(({ icon: Icon, text, link }, index) => (
              <li
                key={index}
                className="flex items-center space-x-2 hover:text-white transition"
              >
                <Icon />
                {link.startsWith("/") ? (
                  <NavLink
                    to={link}
                    onClick={scrollToTop}
                    className="hover:underline"
                  >
                    {text}
                  </NavLink>
                ) : (
                  <a
                    href={link}
                    className="hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {text}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Download Section */}
      <div className="container mx-auto border-t border-gray-600 pt-6 mt-6 text-center">
        <div className="flex flex-wrap justify-center gap-4">
          {[
            { icon: FaApple, platform: "Mac", text: "Download on" },
            { icon: FaWindows, platform: "Windows", text: "Get it on" },
            { icon: FaApple, platform: "App Store", text: "Download on " },
            { icon: FaGooglePlay, platform: "Google Play", text: "Get it on" },
          ].map(({ icon: Icon, platform, text }, index) => (
            <button
              key={index}
              className="flex items-center border border-white px-5 py-3 rounded-lg hover:bg-gray-700 transition duration-300 w-40"
            >
              <Icon className="mr-2 text-xl font-bold" />
              <span className="text-xs">
                {text}
                <br />
                <span className="font-bold">{platform}</span>
              </span>
            </button>
          ))}
        </div>

        {/* Footer Links with Popups */}
        <div className="flex justify-center mt-6 text-gray-400 text-sm space-x-6">
          <button
            onClick={() => openPopup("terms")}
            className="hover:text-white transition duration-300"
          >
            Terms of Service
          </button>
          <button
            onClick={() => openPopup("privacy")}
            className="hover:text-white transition duration-300"
          >
            Privacy Policy
          </button>
          <span>© 2025 Tsdey Donation</span>
        </div>
      </div>

      {/* Popups */}
      <TermsOfServicePopup isOpen={popup === "terms"} onClose={closePopup} />
      <PrivacyPolicyPopup isOpen={popup === "privacy"} onClose={closePopup} />
    </footer>
  );
};

export default Footer;
