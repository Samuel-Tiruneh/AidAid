import React, { useContext } from "react";
import SupportIntro from "./SupportIntro";
import FAQS from "./FAQS";
import ContactSupport from "./ContactSupport";
import SupportGuide from "./SupportGuide";
import Header from "../Header";
import Footer from "../Footer";
import PlatformPolicies from "./PlatformPolicies";
import { ThemeContext } from "../../context/ThemeContext"; // Import ThemeContext

const SupportPage = () => {
  const { isDarkMode } = useContext(ThemeContext); // Use theme context

  return (
    <div className={`${isDarkMode ? "bg-gray-900" : "bg-gray-100"}`}>
      {/* Header */}
     

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 font-[poppins]">
        <SupportIntro />
        <FAQS />
        <ContactSupport />
        <SupportGuide />
        <PlatformPolicies />
      </main>

      {/* Footer */}
    
    </div>
  );
};

export default SupportPage;
