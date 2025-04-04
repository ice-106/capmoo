// components/ToggleButton.tsx
import React, {useState} from 'react';

const ToggleButton: React.FC = () => {
  const [toggle, setToggle] = useState("en");
  const [isChecked, setIsChecked] = useState(false);
  const [toggleLabel, setToggleLabel] = useState("leftLabel");

  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    setIsChecked(isChecked);
    setToggle(isChecked ? "th" : "en");    
    setToggleLabel(isChecked ? "rightLabel" : "leftLabel");
  }

  return (
      <label className="inline-flex items-center mb-5 cursor-pointer">
      <span className={`me-3 text-sm font-medium ${isChecked ? 'text-gray-500' : 'text-orange-500'}`}>EN</span>
      <label htmlFor={toggleLabel} />
      <input type="checkbox" value="" className="sr-only peer" onChange={handleToggle}/>
      <div className="relative w-11 h-6 bg-slate-100 rounded-full transition-colors duration-300">
        <img
          src={isChecked ? 'https://flagcdn.com/20x15/th.png' : 'https://flagcdn.com/20x15/us.png'}
          alt={isChecked ? 'Thailand Flag' : 'USA Flag'}
          className={`w-5 h-5 absolute top-[2px] start-[2px] rounded-full transition-all ${isChecked ? 'translate-x-full rtl:-translate-x-full' : ''}`}
        />
      </div>
      <span className={`ms-3 text-sm font-medium ${isChecked ? 'text-orange-500' : 'text-gray-500'}`}>TH</span>
    </label>
  );
};

export default ToggleButton;