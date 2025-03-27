"use client";

import React, { useState } from "react";

interface TextBoxProps {
  name?: string; // Name for form submission
  placeholder?: string;
  width?: string; // CSS width values (e.g., "100%", "200px")
  errorMessage?: string;
  defaultValue?: string; // Prefilled value
  onBlur?: (value: string) => void; // Callback for blur event
}

const TextBox: React.FC<TextBoxProps> = ({
  name,
  placeholder = "",
  width = "100%",
  errorMessage = "",
  defaultValue = "",
  onBlur = () => {}, // Default no-op function
}) => {
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
        defaultValue={defaultValue}
        className={`${baseStyles} ${currentStyles}`} // Apply dynamic styles
        onFocus={() => setIsFocused(true)} // Set focus state
        onBlur={(e) => {
          setIsFocused(false); // Remove focus state
          onBlur(e.target.value); // Trigger onBlur callback with the input value
        }}
      />
      {errorMessage && (
        <p className="text-red text-caption mt-1">{errorMessage}</p>
      )}
    </div>
  );
};

export default TextBox;
