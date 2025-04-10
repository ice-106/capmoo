// components/ToggleButton.tsx
import React, {useState} from 'react';

interface ToggleButtonProps {
  toggle: string;
  onToggleChange: (toggle: string) => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ toggle, onToggleChange }) => {
  const isChecked = toggle === "th";

  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newToggle = event.target.checked ? "th" : "en";
    onToggleChange(newToggle);
  };

  return (
      <label className="inline-flex items-center mb-5 cursor-pointer">
      <span className={`me-3 text-sm font-medium ${isChecked ? 'text-grey' : 'text-orange'}`}>EN</span>
      <label htmlFor={toggle} />
      <input type="checkbox" value="" className="sr-only peer" checked={isChecked} onChange={handleToggle}/>
      <div className="relative w-11 h-6 bg-slate-100 rounded-full transition-colors duration-300">
        <img
          src={isChecked ? 'https://flagcdn.com/20x15/th.png' : 'https://flagcdn.com/20x15/us.png'}
          alt={isChecked ? 'Thailand Flag' : 'USA Flag'}
          className={`w-5 h-5 absolute top-[2px] start-[2px] rounded-full transition-all ${isChecked ? 'translate-x-full rtl:-translate-x-full' : ''}`}
        />
      </div>
      <span className={`ms-3 text-sm font-medium ${isChecked ? 'text-orange' : 'text-grey'}`}>TH</span>
    </label>
  );
};

export default ToggleButton;
