import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaDonate, FaMoneyBillAlt } from "react-icons/fa";
import VerifiedIcon from "../../assets/DonateAssets/verify.png";
import LogoImg from "../../assets/images/logo.png";
import { ThemeContext } from "../../context/ThemeContext";
import { useAuth } from "../Authentication/AuthContext";

const DonateCard = ({
  id,
  name,
  age,
  gender,
  location,
  category,
  description,
  neededAmount,
  RequesterImg,
  openPopup,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDarkMode } = useContext(ThemeContext);

  const handleDonateClick = () => {
    if (!user) {
      openPopup("login");
    } else {
      // Pass both name and id in the URL
      navigate(`/donate/${id}/${encodeURIComponent(name)}`);
    }
  };

  const handleViewDetails = () => {
    navigate(`/details/${id}`);
  };

  return (
    <div
      className={`shadow-lg rounded-lg p-4 ${
        isDarkMode ? "bg-gray-700" : "bg-white"
      }`}
    >
      <div className="flex items-center mb-2">
        <img
          src={RequesterImg || "/default-image.jpg"}
          alt={name}
          className="w-1/2 h-auto object-cover rounded-md"
        />
        <div className="w-1/2 pl-4">
          <div className="flex items-center pb-10">
            <img src={VerifiedIcon} alt="Verified" className="w-10 h-10 mr-2" />
            <img src={LogoImg} alt="Logo" className="w-14 h-14" />
          </div>
          <h2
            className={`font-bold ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
          >
            {name}
          </h2>
          <p
            className={`text-sm ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            <strong>Age:</strong> {age}
          </p>
          <p
            className={`text-sm ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            <strong>Gender:</strong> {gender}
          </p>
          <p
            className={`text-sm ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            <strong>Location:</strong> {location}
          </p>
          <p
            className={`text-sm ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            <strong>Category:</strong> {category}
          </p>
        </div>
      </div>

      <div
        className={`border-b-4 mx-8 ${
          isDarkMode ? "border-gray-600" : "border-gray-300"
        }`}
      ></div>

      <p className={`mt-3 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
        {description}
      </p>

      <p
        className={`flex items-center gap-2 italic mt-2 text-xl font-bold underline ${
          isDarkMode ? "text-red-400" : "text-red-600"
        }`}
      >
        <FaMoneyBillAlt /> Amount Needed: {neededAmount}
      </p>

      <div className="mt-4 flex flex-col gap-2">
        <button
          className={`text-xl px-4 py-2 rounded-md w-full flex items-center justify-center gap-2 transition duration-300 ease-in-out cursor-pointer ${
            isDarkMode
              ? "bg-gray-600 hover:bg-gray-500"
              : "bg-gray-500 hover:bg-gray-700"
          } text-white`}
          onClick={handleViewDetails}
        >
          <FaEye />
          View Details
        </button>
        <button
          className={`text-xl px-4 py-2 rounded-md w-full flex items-center justify-center gap-2 transition duration-300 ease-in-out cursor-pointer ${
            isDarkMode
              ? "bg-pink-600 hover:bg-pink-700"
              : "bg-pink-500 hover:bg-pink-600"
          } text-white`}
          onClick={handleDonateClick}
        >
          <FaDonate />
          Donate
        </button>
      </div>
    </div>
  );
};

export default DonateCard;
