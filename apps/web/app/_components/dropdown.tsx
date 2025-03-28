"use client";
import React, { useState, useCallback, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp, Square, SquareCheck } from "lucide-react";

interface DropdownProps {
  selected: string[];
  onSelect: (selected: string[]) => void;
  defaultText: string;
  options: string[];
}

const Dropdown = ({
  selected,
  onSelect,
  defaultText,
  options,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Toggle the option in the selected array
  const handleSelectOption = useCallback(
    (option: string) => {
      const newSelected = selected.includes(option)
        ? selected.filter((item) => item !== option)
        : [...selected, option];

      onSelect(newSelected);
    },
    [selected, onSelect],
  );

  return (
    <div ref={dropdownRef} className="relative select-none">
      <div
        className={`flex justify-between items-center gap-2 w-full px-[12px] py-1 border-2 rounded-lg text-caption cursor-pointer transition-all
                    ${isOpen || hover ? "bg-orange text-white" : "bg-white text-orange"}
                    ${isOpen || hover ? "hover:bg-orange" : "hover:bg-gray-100"}
                    active:bg-pumpkin active:border-pumpkin`}
        onClick={() => setIsOpen((prev) => !prev)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <span className="overflow-hidden whitespace-nowrap text-ellipsis">
          {selected.length > 0 ? selected.join(", ") : defaultText}
        </span>
        {isOpen ? (
          <ChevronUp className="flex-shrink-0" />
        ) : (
          <ChevronDown className="flex-shrink-0" />
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-2 border-t-0 mt-1 rounded-lg z-10 max-h-32 overflow-y-auto">
          {options.map((option, index) => (
            <div
              key={index}
              className="flex gap-2 px-4 py-2 cursor-pointer rounded-lg bg-white hover:bg-gray-100"
              onClick={(e) => {
                e.stopPropagation(); // Prevent closing the dropdown when clicking an option
                handleSelectOption(option);
              }}
            >
              {selected.includes(option) ? (
                <SquareCheck color="orange" />
              ) : (
                <Square />
              )}
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
