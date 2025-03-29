// components/ToggleButton.tsx
import React from 'react';

const ToggleButton: React.FC = () => {
  return (
    <label className="inline-flex items-center mb-5 cursor-pointer">
      <span className="me-3 text-sm font-medium text-black">EN</span>
      <input type="checkbox" value="" className="sr-only peer" />
      <div className="relative w-11 h-6 bg-slate-100 rounded-full transition-colors duration-300 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-800"></div>
      <span className="ms-3 text-sm font-medium text-black">TH</span>
    </label>
  );
};

export default ToggleButton;