import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";

const TermsOfService = () => {
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I create a donation request?",
      answer:
        "To create a request, log in to your account, complete the request form, and submit it for review. Our team will verify the information before publishing it on the platform.",
    },
    {
      question: "How are donations distributed?",
      answer:
        "Donations are distributed directly to verified recipients or through trusted partners. We ensure that funds and resources reach those in need as quickly as possible.",
    },
    {
      question: "Can I donate anonymously?",
      answer:
        "Yes, you can choose to donate anonymously. Your personal information will not be shared with the recipient.",
    },
    {
      question: "How do I report suspicious activity?",
      answer:
        "If you encounter suspicious behavior or content, report it immediately through the platform or contact us at [support email].",
    },
    {
      question: "What happens if a donation goal is not met?",
      answer:
        "If a donation goal is not met, the funds raised will still be distributed to the recipient, unless otherwise specified in the request.",
    },
    {
      question: "Are there any fees for using the platform?",
      answer:
        "Yes, [Your Platform Name] may deduct a small processing fee to cover operational costs. This fee will be clearly disclosed during the donation process.",
    },
    {
      question: "Can I cancel a donation after it has been made?",
      answer:
        "Donations are generally non-refundable. If you believe an error occurred during the donation process, contact us at [support email].",
    },
    {
      question: "How do I update my account information?",
      answer:
        "You can update your account information by logging into your account and navigating to the 'Profile' or 'Settings' section.",
    },
  ];

  return (
    <>
      <Header />
      <div className="container mx-auto p-6 max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-6">
          Terms of Service
        </h1>

        {/* Platform Usage Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Platform Usage</h2>
          <div className="space-y-4">
            <p>
              Welcome to [Your Platform Name]! These Terms of Service ("Terms")
              govern your use of our platform, which facilitates the collection
              and provision of aide to those in need. By accessing or using our
              platform, you agree to comply with these Terms. If you do not
              agree, please refrain from using our services.
            </p>
            <h3 className="text-xl font-semibold">1.1 Eligibility</h3>
            <p>
              To use [Your Platform Name], you must be at least 18 years old or
              have the consent of a legal guardian. By using the platform, you
              confirm that you meet these requirements.
            </p>
            <h3 className="text-xl font-semibold">1.2 Account Registration</h3>
            <p>
              To access certain features, you may need to create an account. You
              agree to provide accurate and complete information during
              registration and to keep your account credentials secure. You are
              responsible for all activities under your account.
            </p>
          </div>
        </section>

        {/* Donation Guide Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Donation Guide</h2>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">2.1 Donation Process</h3>
            <p>
              - <strong>Donors</strong>: You can browse verified requests and
              contribute funds or resources directly through the platform. All
              donations are voluntary and non-refundable.
            </p>
            <p>
              - <strong>Recipients</strong>: You may submit requests for aide,
              which will be reviewed and verified by our team before being
              published.
            </p>
            <h3 className="text-xl font-semibold">2.2 Transparency</h3>
            <p>
              We strive to ensure transparency in all transactions. Donors will
              receive confirmation of their contributions, and recipients are
              encouraged to provide updates on how donations are used.
            </p>
          </div>
        </section>

        {/* FAQs Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. FAQs</h2>
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

        {/* General Terms Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">4. General Terms</h2>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">4.1 Privacy</h3>
            <p>
              Your privacy is important to us. Please review our{" "}
              <a href="#" className="text-blue-500 underline">
                Privacy Policy
              </a>{" "}
              to understand how we collect, use, and protect your information.
            </p>
            <h3 className="text-xl font-semibold">
              4.2 Limitation of Liability
            </h3>
            <p>
              [Your Platform Name] is not liable for any indirect, incidental,
              or consequential damages arising from your use of the platform.
            </p>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default TermsOfService;