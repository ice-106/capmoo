"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
// import Drawer from "./drawer";

interface SearchBarProps {
  placeholder?: string;
  width?: string;
  defaultValue?: string;
  onChange?: (value: string) => void; // Callback for change event
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search...",
  width = "100%",
  defaultValue = "",
  onChange = () => {}, // Default no-op function
}) => {
  const [searchQuery, setSearchQuery] = useState(defaultValue);
  const [isFocused, setIsFocused] = useState(false);

  // Define styles (matching TextBox)
  const baseStyles = `p-2 rounded-lg border-2 outline-none text-caption w-full placeholder:italic pl-10`;
  const defaultStyles = `border-lightgrey`;
  const focusStyles = `border-orange`;

    // Determine the current styles
    const currentStyles = isFocused
      ? focusStyles
      : defaultStyles;


  return (
    <>
      {/* Search Input Trigger */}
      <div 
        className="relative cursor-pointer"
        style={{ width }}
      >
        <Search 
          className="absolute left-2 top-1/2 -translate-y-1/2 text-darkgrey"
          size={20}
        />
        <input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          className={`${baseStyles} ${currentStyles} cursor-pointer`}
          onChange={(e) => {
            const newSearchQuery = e.target.value;
            setSearchQuery(newSearchQuery); // Update local state
            onChange(newSearchQuery); // Trigger onChange callback with the input value
          }}
          onFocus={() => setIsFocused(true)} // Set focus state
          onBlur={() => setIsFocused(false)} // Remove focus state
        />
      </div>

    </>
  );
};

export default SearchBar;