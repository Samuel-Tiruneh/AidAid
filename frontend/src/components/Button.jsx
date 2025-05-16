import React from 'react';

const Button = ({ children, onClick }) => {
  return (
    <button
      className="bg-pink-500 text-white font-bold px-6 py-3 rounded hover:bg-pink-600"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
