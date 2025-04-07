"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import SearchDrawer from "./searchDrawer";

interface SearchBarProps {
  placeholder?: string;
  width?: string;
  defaultValue?: string;
  onSearch: (value: string) => void;
  onChange?: (value: string) => void;
  enableDrawer?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search...",
  width = "100%",
  defaultValue = "",
  onSearch,
  onChange = () => {},
  enableDrawer = true,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(defaultValue);
  const [isFocused, setIsFocused] = useState(false);

  const baseStyles = `p-1 rounded-lg border-2 outline-none text-caption w-full placeholder:italic pl-10`;
  const currentStyles = isFocused ? 'border-orange' : 'border-lightgrey/50';

  const handleSubmit = () => {
    onSearch(searchQuery);
    setIsDrawerOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchQuery(newValue);
    onChange(newValue);
  };

  return (
    <>
      <div 
        className="relative cursor-pointer"
        style={{ width }}
        onClick={() => enableDrawer && setIsDrawerOpen(true)}
      >
        <Search 
          className="absolute left-2 top-1/2 -translate-y-1/2 text-darkgrey"
          size={20}
        />
        <input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          readOnly={enableDrawer}
          className={`${baseStyles} ${currentStyles} ${enableDrawer ? 'cursor-pointer' : ''}`}
          onChange={enableDrawer ? undefined : handleChange}
          onFocus={() => !enableDrawer && setIsFocused(true)}
          onBlur={() => !enableDrawer && setIsFocused(false)}
        />
      </div>

      {enableDrawer && isDrawerOpen && (
        <SearchDrawer
          value={searchQuery}
          onChange={setSearchQuery}
          onSubmit={handleSubmit}
          onClose={() => setIsDrawerOpen(false)}
          placeholder={placeholder}
        />
      )}
    </>
  );
};

export default SearchBar;