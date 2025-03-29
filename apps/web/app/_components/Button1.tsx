// components/Button1.tsx
import React from 'react';

const Button1: React.FC = () => {
  return (
    <button className="w-1/8 bg-transparent hover:bg-gray-500 text-gray-700 font-semibold hover:text-white py-2 px-4 border border-gray-500 hover:border-transparent rounded-full">
      Button 1
    </button>
  );
};

export default Button1;