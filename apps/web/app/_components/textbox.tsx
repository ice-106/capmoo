"use client";

import React, { useState } from "react";

interface TextBoxProps {
  name?: string; // Name for form submission
  placeholder?: string;
  width?: string; // CSS width values (e.g., "100%", "200px")
  errorMessage?: string;
  defaultValue?: string; // Prefilled value
  onChange?: (value: string) => void; // Callback for change event
}

const TextBox: React.FC<TextBoxProps> = ({
  name,
  placeholder = "",
  width = "100%",
  errorMessage = "",
  defaultValue = "",
  onChange = () => {}, // Default no-op function
}) => {
  const [value, setValue] = useState(defaultValue); // State to manage input value
  const [isFocused, setIsFocused] = useState(false);

  // Define styles
  const baseStyles = `p-2 rounded-lg border-2 outline-none bg-lightgrey/50 text-caption w-full placeholder:italic`;
  const defaultStyles = `border-darkgrey`;
  const focusStyles = `border-orange`;
  const errorStyles = `border-red`;

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
        name={name} // Name for form submission
        placeholder={placeholder}
        value={value} // Controlled input value
        className={`${baseStyles} ${currentStyles}`} // Apply dynamic styles
        onFocus={() => setIsFocused(true)} // Set focus state
        onBlur={() => setIsFocused(false)} // Remove focus state
        onChange={(e) => {
          const newValue = e.target.value;
          setValue(newValue); // Update local state
          onChange(newValue); // Trigger onChange callback with the input value
        }}
      />
      {errorMessage && (
        <p className="text-red text-caption mt-1">{errorMessage}</p>
      )}
    </div>
  );
};

export default TextBox;