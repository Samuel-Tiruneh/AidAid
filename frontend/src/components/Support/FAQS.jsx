import React, { useState, useContext } from "react";
import { FaPlus, FaMinus } from "react-icons/fa"; // Import icons
import faqImg from "../../assets/SupportAssets/faq.png";
import { ThemeContext } from "../../context/ThemeContext"; // Import ThemeContext

const FAQS = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const { isDarkMode } = useContext(ThemeContext); // Use theme context

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs_donors = [
    {
      question: "How do I make a donation?",
      answer:
        "Simply browse the available aid requests, choose a request, and click on 'Donate' to proceed with the payment.",
    },
    {
      question: "What payment methods are accepted?",
      answer: "We accept PayPal, Stripe, and major credit/debit cards.",
    },
    {
      question: "Can I donate anonymously?",
      answer:
        "Yes, there is an option to hide your name when making a donation.",
    },
    {
      question: "How do I track my past donations?",
      answer:
        "Log in to your account and go to the 'Donation History' section.",
    },
  ];

  const faqs_requesters = [
    {
      question: "How do I create a donation request?",
      answer:
        "To create a request, sign in to your account, go to the 'Create Request' section, fill in the required details, and submit your request for approval.",
    },
    {
      question: "What information should I provide in my request?",
      answer:
        "You should include details about your need, the amount required, supporting documents (if applicable), and how the donation will be used.",
    },
    {
      question: "How long does it take for my request to be approved?",
      answer:
        "Approval times vary, but requests are typically reviewed within 24-48 hours.",
    },
    {
      question: "Can I edit my request after submitting it?",
      answer:
        "Yes, you can edit your request before it gets approved. Once approved, you will need to contact support for modifications.",
    },
    {
      question: "How will I receive the donations?",
      answer:
        "Donations will be transferred to the payment method you provided during the request creation process.",
    },
  ];

  return (
    <div className={`p-8 mr-4 md:mr-8 rounded-2xl shadow-lg ${
      isDarkMode ? "bg-gray-800" : "bg-white"
    }`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center gap-4 justify-center">
        <img
          src={faqImg}
          alt="faq"
          className="w-14 md:w-20 h-auto max-w-full"
        />
        <h2 className={`text-2xl md:text-3xl font-bold inline-block ${
          isDarkMode ? "text-pink-400" : "text-pink-600"
        }`}>
          Frequently Asked Questions (FAQs)
        </h2>
      </div>

      {/* Donors Section */}
      <div className="mt-6 max-w-6xl mx-auto px-8">
        <h3 className={`text-2xl font-bold inline-block ${
          isDarkMode ? "text-gray-300" : "text-slate-500"
        }`}>
          For Donors
        </h3>

        {/* FAQ List */}
        <div className="mt-4">
          {faqs_donors.map((faq, index) => (
            <div
              key={index}
              className={`border-b ${
                isDarkMode ? "border-gray-700" : "border-slate-300"
              } py-5`}
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleFAQ(index)}
              >
                <p className={`text-xl md:text-2xl font-bold ${
                  isDarkMode ? "text-gray-200" : "text-gray-800"
                }`}>
                  {faq.question}
                </p>
                {openIndex === index ? (
                  <FaMinus className="text-pink-600 text-xl" />
                ) : (
                  <FaPlus className="text-pink-600 text-xl" />
                )}
              </div>

              {openIndex === index && (
                <p className={`mt-2 text-xl md:text-2xl font-medium ${
                  isDarkMode ? "text-gray-400" : "text-slate-500"
                }`}>
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Requesters Section */}
      <div className={`mt-24 pt-8 max-w-6xl mx-auto px-8 border-t ${
        isDarkMode ? "border-gray-700" : "border-slate-300"
      }`}>
        <h3 className={`text-2xl font-bold inline-block ${
          isDarkMode ? "text-gray-300" : "text-slate-500"
        }`}>
          For Requesters
        </h3>

        {/* FAQ List */}
        <div className="mt-4">
          {faqs_requesters.map((faq, index) => (
            <div
              key={index}
              className={`border-b ${
                isDarkMode ? "border-gray-700" : "border-slate-300"
              } py-5`}
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleFAQ(index + faqs_donors.length)}
              >
                <p className={`text-xl md:text-2xl font-bold ${
                  isDarkMode ? "text-gray-200" : "text-gray-800"
                }`}>
                  {faq.question}
                </p>
                {openIndex === index + faqs_donors.length ? (
                  <FaMinus className="text-pink-600 text-xl" />
                ) : (
                  <FaPlus className="text-pink-600 text-xl" />
                )}
              </div>

              {openIndex === index + faqs_donors.length && (
                <p className={`mt-2 text-xl md:text-2xl font-medium ${
                  isDarkMode ? "text-gray-400" : "text-slate-500"
                }`}>
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQS;
