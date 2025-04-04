// components/BackButton.tsx
import React from 'react';

const BackButton: React.FC = () => {

  const handleBack = () => {
    window.history.back();
  };

  return (
    <button
      onClick={handleBack}
      className="w-12 h-12 bg-transparent font-semibold py-2 px-2 border border-gray-500 rounded-full hover:bg-gray-500 hover:border-white 
      flex justify-center items-center transition duration-300 ease-in-out group cursor-pointer"
      aria-label="Go back"
      title="Go back"
    >
      <svg
        className="w-6 h-6 text-gray-600 group-hover:text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  );
};

export default BackButton;