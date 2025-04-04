// components/Button.tsx
import React from 'react';

interface ButtonProps {
  label: string; // Define the label prop
  onclick?: () => void; // Optional onClick prop
}

const Button: React.FC<ButtonProps> = ({ label, onclick }) => {
  return (
    <button
      className="w-1/6 bg-transparent hover:bg-orange-500 text-gray-700 font-semibold 
      hover:text-white py-2 px-4 border border-gray-500 hover:border-transparent rounded-xl cursor-pointer"
      onClick={onclick}
    >
      {label}
    </button>
  );
};

export default Button;