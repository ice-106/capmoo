"use client";

import React, { useState, forwardRef } from "react";

interface TextBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name?: string;
  placeholder?: string;
  width?: string;
  errorMessage?: string;
  type?: 'text' | 'number' | 'date';
  textSize?: 'default' | 'small';
  variant?: 'default' | 'light';
}

const TextBox = forwardRef<HTMLInputElement, TextBoxProps>(({
  name,
  placeholder = "",
  width = "100%",
  errorMessage = "",
  value,
  type = 'text',
  onChange,
  textSize = 'default',
  variant = 'default',
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  // Define styles
  const sizeStyles = {
    default: 'p-2',
    small: 'py-1 px-2'
  };

  const variantStyles = {
    default: 'bg-lightgrey/50 border-darkgrey',
    light: 'bg-transparent border-lightgrey/50'
  };
  
  const baseStyles = `rounded-lg border-2 outline-none text-caption w-full placeholder:italic ${sizeStyles[textSize]}`;
  const defaultStyles = variantStyles[variant];
  const focusStyles = `border-orange ${variant === 'light' ? 'bg-transparent' : ''}`;
  const errorStyles = `border-red`;
  
  const currentStyles = errorMessage
    ? errorStyles
    : isFocused
      ? focusStyles
      : defaultStyles;

  // Check if it's being used as controlled or uncontrolled
  const isControlled = value !== undefined;

  return (
    <div style={{ width }}>
      <input
        ref={ref}
        type={type}
        name={name}
        placeholder={placeholder}
        // Only pass value if this is being used as a controlled component
        {...(isControlled ? { value } : {})}
        className={`${baseStyles} ${currentStyles}`}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={onChange}
        {...props}
      />
      {errorMessage && (
        <p className="text-red text-caption mt-1">{errorMessage}</p>
      )}
    </div>
  );
});

TextBox.displayName = "TextBox";

export default TextBox;