"use client";

import React, { useState, useEffect } from "react";

interface TextBoxProps {
  placeholder?: string;
  width?: string; // CSS width values (e.g., "100%", "200px")
  errorMessage?: string;
  value?: string;
  onChange?: (value: string) => void;
}

const TextBox: React.FC<TextBoxProps> = ({
  placeholder = "",
  width = "100%",
  errorMessage = "",
  value = "",
  onChange = () => {},
}) => {
  const [localValue, setLocalValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);

  // Synchronize localValue with the value prop
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Define styles
  const baseStyles = `p-2 rounded-lg border-2 outline-none bg-lightgrey/50 text-caption w-full placeholder:italic`;
  const defaultStyles = `border-darkgrey`;
  const focusStyles = `border-orange`;
  const errorStyles = `border-red text-red`;

  // Determine the current styles
  const currentStyles = errorMessage
    ? errorStyles
    : isFocused
      ? focusStyles
      : defaultStyles;

  return (
    <div style={{ width }}>
      <input
        type="text"
        placeholder={placeholder}
        value={localValue} // Local value for typing
        onChange={(e) => setLocalValue(e.target.value)} // Update local value
        onBlur={() => {
          setIsFocused(false);
          onChange(localValue); // Trigger onChange only on blur
        }}
        onFocus={() => setIsFocused(true)} // Set focus state
        className={`${baseStyles} ${currentStyles}`} // Combine styles dynamically
      />
      {errorMessage && (
        <p className="text-red text-caption mt-1">{errorMessage}</p>
      )}
    </div>
  );
};

export default TextBox;
