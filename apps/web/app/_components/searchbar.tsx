"use client";

import React, { useState, useEffect } from "react"
import { SearchFormValues } from '../_types/search';
import { Search } from "lucide-react";
import SearchDrawer from "./searchDrawer";

interface SearchBarProps {
  placeholder?: string;
  width?: string;
  value?: string;
  defaultValue?: string;
  onSearch: (formValues?: SearchFormValues) => void;
  onChange?: (value: string) => void;
  enableDrawer?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search...",
  width = "100%",
  defaultValue = "",
  onSearch,
  onChange = () => {},
  value,
  enableDrawer = true,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(defaultValue || value || "");
  const [isFocused, setIsFocused] = useState(false);

  const baseStyles = `p-1 rounded-lg border-2 outline-none text-caption w-full placeholder:italic pl-10`;
  const currentStyles = isFocused ? 'border-orange' : 'border-lightgrey/50';

  useEffect(() => {
    if (value !== undefined) {
      setSearchValue(value);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    if (onChange) onChange(newValue);
  };

  const handleDrawerSubmit = (formValues?: SearchFormValues) => {
    // Pass the complete form values from drawer
    onSearch(formValues);
    setIsDrawerOpen(false);
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
          value={searchValue}
          readOnly={enableDrawer}
          className={`${baseStyles} ${currentStyles} ${enableDrawer ? 'cursor-pointer' : ''}`}
          onChange={enableDrawer ? undefined : handleChange}
          onFocus={() => !enableDrawer && setIsFocused(true)}
          onBlur={() => !enableDrawer && setIsFocused(false)}
        />
      </div>

      {enableDrawer && isDrawerOpen && (
        <SearchDrawer
          value={searchValue}
          onChange={(value: string) => handleChange({ target: { value } } as React.ChangeEvent<HTMLInputElement>)}
          onSubmit={handleDrawerSubmit}
          onClose={() => setIsDrawerOpen(false)}
          placeholder={placeholder}
        />
      )}
    </>
  );
};

export default SearchBar;