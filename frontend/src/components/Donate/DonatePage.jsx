// import React, { useState, useEffect, useContext } from "react";
// import axios from "axios";
// import DonateIntro from "./DonateIntro";
// import DonateSort from "./DonateSort";
// import DonateCard from "./DonateCard";
// import DonateViewMore from "./DonateViewMore";
// import DonateSearch from "./DonateSearch";
// import { FaSearch } from "react-icons/fa";
// import { ThemeContext } from "../../context/ThemeContext";

// const DonatePage = ({ openPopup }) => {
//   const [allData, setAllData] = useState([]); // All approved donation data
//   const [filteredData, setFilteredData] = useState([]); // Filtered data based on search/query
//   const [searchQuery, setSearchQuery] = useState("");
//   const { isDarkMode } = useContext(ThemeContext);
//   const [limit, setLimit] = useState(6);
//   const [error, setError] = useState(null);

//   // Fetch approved donation data from API
//   useEffect(() => {
//     const fetchDonationData = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:5000/api/request-donate",
//           {
//             params: {
//               requestStatus: "Approved",
//               isApproved: true,
//               donationStatus: "Active",
//               limit,
//               offset: 0,
//             },
//           }
//         );
//         const data = response.data;
//         setAllData(data);
//         setFilteredData(data.slice(0, limit));
//         setError(null);
//       } catch (error) {
//         console.error("Error fetching approved donation data:", error);
//         setError("Failed to load donation requests. Please try again.");
//       }
//     };

//     fetchDonationData();
//   }, [limit]);

//   const handleSearchChange = (e) => {
//     setSearchQuery(e.target.value);
//   };

//   const handleSearch = () => {
//     const query = searchQuery.toLowerCase();
//     const results = allData.filter(
//       (item) =>
//         item.fullName.toLowerCase().includes(query) ||
//         item.location.toLowerCase().includes(query) ||
//         item.gender.toLowerCase().includes(query) ||
//         String(item.age).includes(query)
//     );
//     setFilteredData(results);
//   };

//   const handleClearSearch = () => {
//     setSearchQuery("");
//     setFilteredData(allData.slice(0, limit));
//   };

//   const handleViewMore = () => {
//     setLimit(limit + 6);
//   };

//   return (
//     <div
//       className={`min-h-screen p-6 font-[poppins] ${
//         isDarkMode ? "bg-gray-800" : "bg-gray-100"
//       } overflow-hidden`}
//     >
//       <DonateIntro />

//       <div className="flex justify-center items-center h-full">
//         <DonateSearch
//           value={searchQuery}
//           onChange={handleSearchChange}
//           handleSearch={handleSearch}
//           onClearSearch={handleClearSearch}
//         />
//       </div>

//       {/* Donate Sort component */}
//       <DonateSort
//         data={allData}
//         setFilteredData={setFilteredData}
//         searchQuery={searchQuery}
//         onSearchChange={handleSearchChange}
//         onSearch={handleSearch}
//         onClearSearch={handleClearSearch}
//       />

//       {/* Render filtered data */}
//       {error ? (
//         <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 w-full rounded-lg border border-dashed border-pink-400 bg-pink-50 dark:bg-gray-700 dark:border-pink-300 transition-all text-center">
//           <h2
//             className={`text-xl font-semibold ${
//               isDarkMode ? "text-white" : "text-gray-800"
//             }`}
//           >
//             Error
//           </h2>
//           <p
//             className={`text-sm mt-2 max-w-sm ${
//               isDarkMode ? "text-gray-300" : "text-gray-600"
//             }`}
//           >
//             {error}
//           </p>
//         </div>
//       ) : (
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
//           {filteredData.length > 0 ? (
//             filteredData.map((requester) => (
//               <DonateCard
//                 key={requester._id}
//                 id={requester._id}
//                 name={requester.fullName}
//                 age={requester.age}
//                 gender={requester.gender}
//                 location={requester.location}
//                 category={requester.category}
//                 description={requester.caseDescription}
//                 neededAmount={requester.neededAmount}
//                 RequesterImg={requester.photo}
//                 openPopup={() => openPopup(requester._id)}
//               />
//             ))
//           ) : (
//             <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 w-full rounded-lg border border-dashed border-pink-400 bg-pink-50 dark:bg-gray-700 dark:border-pink-300 transition-all text-center">
//               <div className="text-pink-500 dark:text-pink-300 text-6xl mb-4 animate-bounce">
//                 <FaSearch />
//               </div>
//               <h2
//                 className={`text-xl font-semibold ${
//                   isDarkMode ? "text-white" : "text-gray-800"
//                 }`}
//               >
//                 Oops! No Results Found
//               </h2>
//               <p
//                 className={`text-sm mt-2 max-w-sm ${
//                   isDarkMode ? "text-gray-300" : "text-gray-600"
//                 }`}
//               >
//                 We couldn't find any matches for your search. Try adjusting your
//                 keywords or filters.
//               </p>
//             </div>
//           )}
//         </div>
//       )}

//       {/* View More Button */}
//       {allData.length > filteredData.length && (
//         <DonateViewMore
//           filteredData={filteredData}
//           setFilteredData={setFilteredData}
//           handleViewMore={handleViewMore}
//         />
//       )}
//     </div>
//   );
// };

// export default DonatePage;



import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import DonateIntro from "./DonateIntro";
import DonateSort from "./DonateSort";
import DonateCard from "./DonateCard";
import DonateViewMore from "./DonateViewMore";
import DonateSearch from "./DonateSearch";
import { FaSearch } from "react-icons/fa";
import { ThemeContext } from "../../context/ThemeContext";

const DonatePage = ({ openPopup }) => {
  const [allData, setAllData] = useState([]); // All approved donation data
  const [filteredData, setFilteredData] = useState([]); // Filtered data based on search/query
  const [searchQuery, setSearchQuery] = useState("");
  const { isDarkMode } = useContext(ThemeContext);
  const [limit, setLimit] = useState(6);
  const [error, setError] = useState(null);

  // Fetch approved donation data from API
  useEffect(() => {
    const fetchDonationData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/request-donate",
          {
            params: {
              requestStatus: "Approved",
              isApproved: true,
              donationStatus: "Active",
              limit,
              offset: 0,
            },
          }
        );
        const data = response.data;
        setAllData(data);
        setFilteredData(data.slice(0, limit));
        setError(null);
      } catch (error) {
        console.error("Error fetching approved donation data:", error);
        setError("Failed to load donation requests. Please try again.");
      }
    };

    fetchDonationData();
  }, [limit]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    const query = searchQuery.toLowerCase();
    const results = allData.filter(
      (item) =>
        item.fullName.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query) ||
        item.gender.toLowerCase().includes(query) ||
        String(item.age).includes(query)
    );
    setFilteredData(results);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setFilteredData(allData.slice(0, limit));
  };

  const handleViewMore = () => {
    setLimit(limit + 6);
  };

  return (
    <div
      className={`min-h-screen p-6 font-[poppins] ${
        isDarkMode ? "bg-gray-900" : "bg-gray-100"
      } overflow-hidden`}
    >
      <DonateIntro />

      <div className="flex justify-center items-center h-full">
        <DonateSearch
          value={searchQuery}
          onChange={handleSearchChange}
          handleSearch={handleSearch}
          onClearSearch={handleClearSearch}
        />
      </div>

      {/* Donate Sort component */}
      <DonateSort
        data={allData}
        setFilteredData={setFilteredData}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onSearch={handleSearch}
        onClearSearch={handleClearSearch}
      />

      {/* Render filtered data */}
      {error ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 w-full rounded-lg border border-dashed border-pink-400 bg-pink-50 dark:bg-gray-700 dark:border-pink-300 transition-all text-center">
          <h2
            className={`text-xl font-semibold ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Error
          </h2>
          <p
            className={`text-sm mt-2 max-w-sm ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {error}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filteredData.length > 0 ? (
            filteredData.map((requester) => (
              <DonateCard
                key={requester._id}
                id={requester._id}
                name={requester.fullName}
                age={requester.age}
                gender={requester.gender}
                location={requester.location}
                category={requester.category}
                description={requester.caseDescription}
                neededAmount={requester.neededAmount}
                RequesterImg={requester.photo}
                openPopup={() => openPopup(requester._id)}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 w-full rounded-lg border border-dashed border-pink-400 bg-pink-50 dark:bg-gray-700 dark:border-pink-300 transition-all text-center">
              <div className="text-pink-500 dark:text-pink-300 text-6xl mb-4 animate-bounce">
                <FaSearch />
              </div>
              <h2
                className={`text-xl font-semibold ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                Oops! No Results Found
              </h2>
              <p
                className={`text-sm mt-2 max-w-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                We couldn't find any matches for your search. Try adjusting your
                keywords or filters.
              </p>
            </div>
          )}
        </div>
      )}

      {/* View More Button */}
      {allData.length > filteredData.length && (
        <DonateViewMore
          filteredData={filteredData}
          setFilteredData={setFilteredData}
          handleViewMore={handleViewMore}
        />
      )}
    </div>
  );
};

export default DonatePage;