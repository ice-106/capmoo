"use client";
import React from 'react';
import { ReactNode } from 'react';

interface CategoryCheckboxProps {
  icon: ReactNode;
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

const IconCheckbox: React.FC<CategoryCheckboxProps> = ({ 
  icon, 
  label, 
  isSelected, 
  onClick 
}) => {
  return (
    <div 
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer
        ${isSelected 
          ? 'text-pumpkin border-pumpkin' 
          : 'text-darkgrey border-lightgrey hover:border-grey'
        }
      `}
      onClick={onClick}
    >
      <div className={`${isSelected ? 'text-pumpkin' : 'text-darkgrey'}`}>
        {icon}
      </div>
      <span className="font-medium">{label}</span>
    </div>
  );
};

export default IconCheckbox;