// FloatingDonateButton.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const FloatingDonateButton = () => {
  return (
    <Link
      to="/donate"
      className="fixed bottom-8 right-8 bg-pink-600 text-white p-4 rounded-full shadow-lg hover:bg-pink-700"
    >
      Donate
    </Link>
  );
};

export default FloatingDonateButton;
