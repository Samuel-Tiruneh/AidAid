import React, { useContext } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { ThemeContext } from "../../context/ThemeContext";

const DonateSearch = ({ value, onChange, handleSearch, onClearSearch }) => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div
      className={`w-full max-w-md flex items-center px-4 rounded-md border transition ${
        isDarkMode
          ? "border-pink-400 bg-gray-700"
          : "border-pink-500 bg-white"
      }`}
    >
      <input
        type="text"
        aria-label="Search Donations"
        placeholder="Type Name, Location, Age or Gender"
        className={`w-full text-xs bg-transparent py-[11px] outline-none ${
          isDarkMode
            ? "text-white placeholder-gray-300"
            : "text-gray-800 placeholder-gray-500"
        }`}
        value={value}
        onChange={onChange}
      />

      {value && (
        <button
          aria-label="Clear Search"
          onClick={onClearSearch}
          className="mx-2"
        >
          <IoMdClose
            className={`text-xl cursor-pointer transition ${
              isDarkMode
                ? "text-pink-400 hover:text-gray-200"
                : "text-pink-500 hover:text-black"
            }`}
          />
        </button>
      )}

      <button
        aria-label="Search"
        onClick={handleSearch}
        className="ml-1"
      >
        <FaMagnifyingGlass
          className={`text-lg cursor-pointer transition ${
            isDarkMode
              ? "text-pink-400 hover:text-gray-200"
              : "text-pink-500 hover:text-black"
          }`}
        />
      </button>
    </div>
  );
};


export default DonateSearch;
