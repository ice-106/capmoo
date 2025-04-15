"use client";
import React, { ReactNode } from 'react';

interface SelectionCardProps {
  icon: ReactNode;
  label: string;
  isSelected: boolean;
  onClick: () => void;
  variant?: 'icon' | 'card';
  className?: string;
}

const SelectionCard: React.FC<SelectionCardProps> = ({ 
  icon, 
  label, 
  isSelected, 
  onClick,
  variant = 'icon',
  className = ''
}) => {
  // Common styles for both variants
  const commonStyles = `
    cursor-pointer transition-all border
    ${isSelected 
      ? 'border-pumpkin' 
      : 'border-lightgrey hover:border-grey'
    }
  `;

  const variantStyles = {
    icon: `
      flex items-center gap-2 px-4 py-2 rounded-lg
      ${isSelected ? 'text-pumpkin' : 'text-darkgrey'}
    `,
    card: `
      flex flex-col items-center justify-center gap-2 p-6 rounded-lg flex-1
      ${isSelected ? 'bg-orange/10' : 'bg-white'}
    `
  };

  const iconStyles = {
    icon: `${isSelected ? 'text-pumpkin' : 'text-darkgrey'}`,
    card: `text-3xl ${isSelected ? 'text-pumpkin' : 'text-darkgrey'}`
  };

  const textStyles = {
    icon: 'font-medium',
    card: `font-medium ${isSelected ? 'text-pumpkin' : 'text-darkgrey'}`
  };

  return (
    <div 
      className={`${commonStyles} ${variantStyles[variant]} ${className}`}
      onClick={onClick}
    >
      <div className={iconStyles[variant]}>
        {icon}
      </div>
      <span className={textStyles[variant]}>
        {label}
      </span>
    </div>
  );
};

export default SelectionCard;