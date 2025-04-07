"use client";

import React, { useState, useEffect } from "react";

interface TextBoxProps {
  name?: string;
  placeholder?: string;
  width?: string;
  errorMessage?: string;
  value?: string;
  onChange?: (value: string) => void;
  size?: 'default' | 'small';
  variant?: 'default' | 'light'; // Add color variant
}

const TextBox: React.FC<TextBoxProps> = ({
  name,
  placeholder = "",
  width = "100%",
  errorMessage = "",
  value = "",
  onChange = () => {},
  size = 'default',
  variant = 'default', // Default color variant
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Define styles
  const sizeStyles = {
    default: 'p-2',
    small: 'py-1 px-2'
  };

  const variantStyles = {
    default: 'bg-lightgrey/50 border-darkgrey',
    light: 'bg-transparent border-lightgrey/50'
  };
  
  const baseStyles = `rounded-lg border-2 outline-none text-caption w-full placeholder:italic ${sizeStyles[size]}`;
  const defaultStyles = variantStyles[variant];
  const focusStyles = `border-orange ${variant === 'light' ? 'bg-transparent' : ''}`;
  const errorStyles = `border-red`;
  
  const currentStyles = errorMessage
    ? errorStyles
    : isFocused
      ? focusStyles
      : defaultStyles;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
  };

  return (
    <div style={{ width }}>
      <input
        type="text"
        name={name}
        placeholder={placeholder}
        value={inputValue}
        className={`${baseStyles} ${currentStyles}`}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={handleChange}
      />
      {errorMessage && (
        <p className="text-red text-caption mt-1">{errorMessage}</p>
      )}
    </div>
  );
};

export default TextBox;