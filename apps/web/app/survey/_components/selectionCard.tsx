"use client";

import React, { ReactNode } from 'react';

interface SelectionCardProps {
  icon: ReactNode;
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

const SelectionCard: React.FC<SelectionCardProps> = ({ 
  icon, 
  label, 
  isSelected, 
  onClick 
}) => {
  return (
    <div 
      className={`
        flex flex-col items-center justify-center gap-2 p-6
        border rounded-lg cursor-pointer transition-all flex-1
        ${isSelected 
          ? 'border-pumpkin' 
          : 'border-lightgrey hover:border-grey'
        }
      `}
      onClick={onClick}
    >
      <div className={`text-3xl ${isSelected ? 'text-pumpkin' : 'text-darkgrey'}`}>
        {icon}
      </div>
      <span className={`font-medium ${isSelected ? 'text-pumpkin' : 'text-darkgrey'}`}>
        {label}
      </span>
    </div>
  );
};

export default SelectionCard;