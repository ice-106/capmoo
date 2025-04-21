"use client";

import React, { useState, forwardRef } from "react";

interface TextBoxProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  name?: string;
  placeholder?: string;
  width?: string;
  errorMessage?: string;
  type?: 'text' | 'number' | 'date' | 'textarea' | 'password';
  textSize?: 'default' | 'small';
  variant?: 'default' | 'light';
  sizeVariant?: 'original' | 'big';
}

const TextBox = forwardRef<HTMLInputElement | HTMLTextAreaElement, TextBoxProps>(({
  name,
  placeholder = "",
  width = "100%",
  errorMessage = "",
  value,
  type = 'text',
  onChange,
  textSize = 'default',
  variant = 'default',
  sizeVariant = 'original',
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

  const boxHeight = sizeVariant === 'big' ? 'h-40' : '';
  const baseStyles = `rounded-lg border-2 outline-none text-caption w-full placeholder:italic ${sizeStyles[textSize]} ${boxHeight}`;
  const defaultStyles = variantStyles[variant];
  const focusStyles = `border-orange ${variant === 'light' ? 'bg-transparent' : ''}`;
  const errorStyles = `border-red`;

  const currentStyles = errorMessage
    ? errorStyles
    : isFocused
      ? focusStyles
      : defaultStyles;

  const isControlled = value !== undefined;

  return (
    <div style={{ width }}>
      {type === 'textarea' ? (
        <textarea
          ref={ref as React.RefObject<HTMLTextAreaElement>}
          name={name}
          placeholder={placeholder}
          rows={6}
          {...(isControlled ? { value } : {})}
          className={`${baseStyles} ${currentStyles}`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={onChange}
          {...props}
        />
      ) : (
        <input
          ref={ref as React.RefObject<HTMLInputElement>}
          type={type}
          name={name}
          placeholder={placeholder}
          {...(isControlled ? { value } : {})}
          className={`${baseStyles} ${currentStyles}`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={onChange}
          {...props}
        />
      )}
      {errorMessage && (
        <p className="text-red text-caption mt-1">{errorMessage}</p>
      )}
    </div>
  );
});

TextBox.displayName = "TextBox";

export default TextBox;
