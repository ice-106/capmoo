// components/Button.tsx
import React from 'react';

interface ButtonProps {
  label: string;
  onClick?: () => void;
  variant?: 'default' | 'orange';
}

const Button: React.FC<ButtonProps> = ({ label, onClick, variant = 'default' }) => {
  const baseClasses =
    'w-full font-semibold py-2 px-4 border rounded-full cursor-pointer';
  const defaultClasses =
    'bg-white hover:bg-orange text-grey hover:text-white border-grey hover:border-transparent';
  const orangeClasses =
    'bg-orange text-white hover:bg-orange/90 border-transparent';

  const classes =
    variant === 'orange' ? `${baseClasses} ${orangeClasses}` : `${baseClasses} ${defaultClasses}`;

  return (
    <button className={classes} onClick={onClick}>
      {label}
    </button>
  );
};

export default Button;
