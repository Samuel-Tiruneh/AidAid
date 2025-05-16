import { useState, useContext } from "react";
import { FaLock, FaUsers, FaGlobe, FaHandsHelping, FaArrowRight, FaQuestionCircle, FaRegLightbulb, FaHandshake } from "react-icons/fa";
import JoinForm from "./JoinForm";
import Header from "./Header";
import Footer from "./Footer";
import { ThemeContext } from "../context/ThemeContext";

export default function JoinPage() {
  const [showForm, setShowForm] = useState(false);
  const [expandedFAQs, setExpandedFAQs] = useState({});
  const { isDarkMode } = useContext(ThemeContext); // Use theme context

  const handleExpand = (id) => {
    setExpandedFAQs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      <div className={`flex flex-col items-center p-12 min-h-screen ${
        isDarkMode ? "bg-gray-900" : "bg-gray-100"
      }`}>
        {/* Main Content Card */}
        <div className={`shadow-2xl rounded-3xl p-14 text-center max-w-4xl border transition-all transform hover:scale-105 hover:shadow-3xl ${
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}>
          <h2 className={`text-5xl font-extrabold leading-tight ${
            isDarkMode ? "text-gray-100" : "text-gray-900"
          }`}>
            Join Our Global <br /> Donation Network
          </h2>
          <p className={`mt-6 text-xl leading-relaxed ${
            isDarkMode ? "text-gray-300" : "text-gray-700"
          }`}>
            Become part of a community dedicated to making a difference. Whether you're looking to donate, support a cause, or receive assistance, our platform provides the tools to amplify generosity and create lasting change.
          </p>
          <ul className="text-left mt-8 space-y-5 text-lg">
            {[
              { icon: <FaLock className="text-pink-600" />, title: "Seamless & Secure Donations", desc: "Effortless giving with industry-leading security measures." },
              { icon: <FaGlobe className="text-pink-600" />, title: "Expand Your Reach", desc: "Connect with a global network of supporters and donors." },
              { icon: <FaUsers className="text-pink-600" />, title: "Boost Visibility", desc: "Gain exposure and attract more donations to your cause." },
              { icon: <FaHandsHelping className="text-pink-600" />, title: "Make a Difference", desc: "Every contribution leads to meaningful impact." },
            ].map((item, index) => (
              <li key={index} className={`flex items-center gap-4 ${
                isDarkMode ? "text-gray-300" : "text-gray-800"
              }`}>
                {item.icon}
                <span className="font-semibold">{item.title}</span> - {item.desc}
              </li>
            ))}
          </ul>
          <div className="flex justify-center">
            <button
              onClick={() => setShowForm(!showForm)}
              className="mt-10 px-14 py-4 bg-pink-600 text-white rounded-full text-xl font-bold hover:bg-pink-700 transition-all transform hover:scale-110 shadow-lg flex items-center justify-center gap-3"
            >
              {showForm ? "Hide Form" : "Join Now"} <FaArrowRight />
            </button>
          </div>
        </div>

        {/* Join Form */}
        {showForm && (
          <div className={`mt-12 p-10 rounded-3xl shadow-2xl w-full max-w-lg border transition-all transform hover:scale-105 ${
            isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}>
            <JoinForm />
          </div>
        )}

        {/* Why Join Us Section */}
        <div className={`mt-16 max-w-3xl text-center p-10 rounded-3xl shadow-lg border ${
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}>
          <h3 className={`text-4xl font-bold ${
            isDarkMode ? "text-gray-100" : "text-gray-900"
          }`}>
            Why Join Us?
          </h3>
          <p className={`mt-6 text-lg leading-relaxed ${
            isDarkMode ? "text-gray-300" : "text-gray-700"
          }`}>
            Our platform empowers both donors and recipients by providing a seamless way to connect, contribute, and create change. 
            With a secure and transparent donation process, every contribution counts and is directed toward impactful causes.
          </p>
        </div>

        {/* FAQs Section */}
        <div className={`mt-12 max-w-3xl mx-auto text-center p-10 rounded-3xl shadow-lg border ${
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}>
          <h3 className={`text-4xl font-extrabold mb-6 ${
            isDarkMode ? "text-gray-100" : "text-gray-900"
          }`}>
            Frequently Asked Questions
          </h3>
          <ul className="mt-8 text-left space-y-6 text-lg">
            {[
              { key: "security", question: "Is my donation secure?", answer: "Yes! We use industry-standard encryption and fraud protection for all transactions." },
              { key: "donations", question: "How do I start receiving donations?", answer: "Simply sign up, complete your profile, and create a campaign." },
              { key: "fees", question: "Are there any fees?", answer: "We keep fees minimal and transparent to ensure maximum impact." },
              { key: "engagement", question: "How can I engage more donors?", answer: "Use our tools for personalized messages, updates, and social sharing." }
            ].map((faq) => (
              <li key={faq.key} className={`flex flex-col border-b pb-4 ${
                isDarkMode ? "border-gray-600" : "border-gray-300"
              }`}>
                <div
                  className="flex justify-between items-center cursor-pointer hover:text-gray-700 transition-all"
                  onClick={() => handleExpand(faq.key)}
                >
                  <strong className={isDarkMode ? "text-gray-100" : "text-gray-900"}>
                    {faq.question}
                  </strong>
                  <FaArrowRight
                    className={`transition-transform transform ${
                      expandedFAQs[faq.key] ? "rotate-90" : ""
                    } ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}
                  />
                </div>
                {expandedFAQs[faq.key] && (
                  <p className={`mt-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}>
                    {faq.answer}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
