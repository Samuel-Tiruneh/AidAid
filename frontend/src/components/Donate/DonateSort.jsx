import React, { useState, useContext, useEffect } from "react";
import DonateSearch from "./DonateSearch";
import { FaFilter, FaMapMarkerAlt, FaDollarSign, FaUser } from "react-icons/fa";
import { ThemeContext } from "../../context/ThemeContext";

const cities = [
  "Addis Ababa", "Addis Alem", "Addis Zemen", "Adigrat", "Adwa", "Agaro", "Akaki", "Alaba",
  "Alamata", "Alitena", "Amba Mariam", "Ambo", "Ankober", "Arba Minch", "Arboye", "Asaita",
  "Asella", "Asosa", "Assosa", "Awasa", "Awash", "Axum", "Babille", "Baco", "Badme", "Bahir dar",
  "Bale Robe", "Bati", "Bedele", "Beica", "Bichena", "Bishoftu", "Boditi", "Bonga", "Burayu",
  "Butajira", "Chiro", "Ciro", "Chencha", "Dabat", "Dangila", "Debre Berhan", "Debre Birhan",
  "Debre Markos", "Debre Tabor", "Debre Werq", "Debre Zebit", "Dejen", "Dembidolo", "Dessie",
  "Dila", "Dire Dawa", "Dolo Bay", "Dolo Odo", "Durame", "Gambela", "Gimbi", "Goba", "Gode",
  "Gondar", "Gonder", "Gursum", "Harar", "Haramaya", "Hawassa", "Hosaena", "Holeta", "Jijiga",
  "Jimma", "Kombolcha", "Meki", "Mekelle", "Negele Borana", "Nekemte", "Sebeta", "Shashamane",
  "Shire", "Sodo", "Tepi", "Weldiya", "Welkite", "Wolaita Sodo", "Wukro", "Yirgalem"
];

const DonateSort = ({
  data,
  setFilteredData,
  searchQuery,
  onSearchChange,
  onSearch,
  onClearSearch,
}) => {
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [amountSorting, setAmountSorting] = useState("");
  const [ageSorting, setAgeSorting] = useState("");
  const { isDarkMode } = useContext(ThemeContext);

  const handleFilterAndSort = () => {
    let filtered = [...data];

    if (category) {
      filtered = filtered.filter(
        (item) => item.category && item.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (location) {
      filtered = filtered.filter(
        (item) => item.location && item.location.toLowerCase() === location.toLowerCase()
      );
    }

    if (amountSorting) {
      filtered.sort((a, b) => {
        const amountA = parseFloat(a.neededAmount.replace(/,/g, "").replace(/ETB/g, ""));
        const amountB = parseFloat(b.neededAmount.replace(/,/g, "").replace(/ETB/g, ""));
        return amountSorting === "low-to-high" ? amountA - amountB : amountB - amountA;
      });
    }

    if (ageSorting) {
      filtered.sort((a, b) => {
        const ageA = parseInt(a.age);
        const ageB = parseInt(b.age);
        return ageSorting === "young-to-old" ? ageA - ageB : ageB - ageA;
      });
    }

    setFilteredData(filtered);
  };

  useEffect(() => {
    handleFilterAndSort();
  }, [category, location, amountSorting, ageSorting, searchQuery, data]);

  return (
    <div className={`shadow-md rounded-lg p-4 mt-4 flex flex-col items-center ${isDarkMode ? "bg-gray-600" : "bg-gray-200"}`}>
      <div className="flex flex-wrap gap-4 justify-center mb-4">
        {/* Category Filter */}
        <div className={`shadow-sm rounded-md p-2 flex items-center gap-2 ${isDarkMode ? "bg-gray-700" : "bg-white"}`}>
          <FaFilter className="text-pink-500" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`w-full px-2 py-1 text-sm rounded-md focus:outline-none ${isDarkMode ? "bg-gray-700 text-white" : "bg-white text-gray-800"}`}
          >
            <option value="">Category</option>
            <option value="Medical">Medical</option>
            <option value="Education">Education</option>
            <option value="Food">Food</option>
          </select>
        </div>

        {/* Location Filter */}
        <div className={`shadow-sm rounded-md p-2 flex items-center gap-2 ${isDarkMode ? "bg-gray-700" : "bg-white"}`}>
          <FaMapMarkerAlt className="text-pink-500" />
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className={`rounded-md focus:outline-none ${isDarkMode ? "bg-gray-700 text-white" : "bg-white text-gray-800"}`}
          >
            <option value="">Location</option>
            {cities.map((city, i) => (
              <option key={i} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {/* Amount Sorting */}
        <div className={`shadow-sm rounded-md p-2 flex items-center gap-2 ${isDarkMode ? "bg-gray-700" : "bg-white"}`}>
          <FaDollarSign className="text-pink-500" />
          <select
            value={amountSorting}
            onChange={(e) => setAmountSorting(e.target.value)}
            className={`rounded-md focus:outline-none ${isDarkMode ? "bg-gray-700 text-white" : "bg-white text-gray-800"}`}
          >
            <option value="">Amount</option>
            <option value="low-to-high">Low to High</option>
            <option value="high-to-low">High to Low</option>
          </select>
        </div>

        {/* Age Sorting */}
        <div className={`shadow-sm rounded-md p-2 flex items-center gap-2 ${isDarkMode ? "bg-gray-700" : "bg-white"}`}>
          <FaUser className="text-pink-500" />
          <select
            value={ageSorting}
            onChange={(e) => setAgeSorting(e.target.value)}
            className={`rounded-md focus:outline-none ${isDarkMode ? "bg-gray-700 text-white" : "bg-white text-gray-800"}`}
          >
            <option value="">Age</option>
            <option value="young-to-old">Young to Old</option>
            <option value="old-to-young">Old to Young</option>
          </select>
        </div>
      </div>

     
    </div>
  );
};

export default DonateSort;
