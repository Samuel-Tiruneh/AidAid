import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";

const PrivacyPolicy = () => {
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const faqs = [
    {
      question: "What information do you collect?",
      answer:
        "We collect information you provide when you register, such as your name, email address, and payment details. We also collect usage data, such as IP addresses and browser information.",
    },
    {
      question: "How do you use my information?",
      answer:
        "We use your information to provide and improve our services, process donations, and communicate with you. We may also use it for analytics and security purposes.",
    },
    {
      question: "Do you share my information with third parties?",
      answer:
        "We may share your information with trusted third-party service providers (e.g., payment processors) to facilitate our services. We do not sell your information to third parties.",
    },
    {
      question: "How do you protect my information?",
      answer:
        "We use industry-standard security measures, such as encryption and secure servers, to protect your information from unauthorized access or disclosure.",
    },
    {
      question: "Can I access or delete my information?",
      answer:
        "Yes, you can access, update, or delete your information by logging into your account or contacting us at [support email].",
    },
    {
      question: "Do you use cookies?",
      answer:
        "Yes, we use cookies to enhance your experience on our platform. You can manage cookies through your browser settings.",
    },
    {
      question: "How long do you retain my information?",
      answer:
        "We retain your information for as long as necessary to provide our services or as required by law.",
    },
    {
      question: "What are my rights under data protection laws?",
      answer:
        "Depending on your jurisdiction, you may have rights such as access, rectification, erasure, and data portability. Contact us for more information.",
    },
  ];

  return (
    <>
      <Header />
      <div className="container mx-auto p-6 max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-6">Privacy Policy</h1>

        {/* Introduction Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <div className="space-y-4">
            <p>
              At [Your Platform Name], we are committed to protecting your
              privacy. This Privacy Policy explains how we collect, use, and
              safeguard your information when you use our platform. By using our
              services, you agree to the terms outlined in this policy.
            </p>
          </div>
        </section>

        {/* Information Collection Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            2. Information We Collect
          </h2>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">2.1 Personal Information</h3>
            <p>
              We collect personal information such as your name, email address,
              and payment details when you register or make a donation.
            </p>
            <h3 className="text-xl font-semibold">2.2 Usage Data</h3>
            <p>
              We automatically collect usage data, including IP addresses,
              browser types, and pages visited, to improve our platform and
              services.
            </p>
          </div>
        </section>

        {/* Use of Information Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            3. How We Use Your Information
          </h2>
          <div className="space-y-4">
            <p>We use your information to:</p>
            <ul className="list-disc pl-6">
              <li>Provide and improve our services.</li>
              <li>Process donations and communicate with you.</li>
              <li>Analyze usage patterns and enhance security.</li>
            </ul>
          </div>
        </section>

        {/* Information Sharing Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            4. Information Sharing
          </h2>
          <div className="space-y-4">
            <p>
              We may share your information with trusted third-party service
              providers (e.g., payment processors) to facilitate our services.
              We do not sell your information to third parties.
            </p>
          </div>
        </section>

        {/* Data Security Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
          <div className="space-y-4">
            <p>
              We use industry-standard security measures, such as encryption and
              secure servers, to protect your information from unauthorized
              access or disclosure.
            </p>
          </div>
        </section>

        {/* FAQs Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. FAQs</h2>
          <div className="space-y-2">
            {faqs.map((faq, index) => (
              <div key={index} className="border rounded-lg p-4">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left font-semibold focus:outline-none"
                >
                  {faq.question}
                </button>
                {expandedFAQ === index && (
                  <p className="mt-2 text-gray-700">{faq.answer}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Contact Information Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
          <div className="space-y-4">
            <p>
              If you have questions about this Privacy Policy or our data
              practices, contact us using below contact addresses in the footer.
            </p>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;