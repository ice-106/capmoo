"use client";

import React, { useState, useEffect, KeyboardEvent } from "react";
import { SendHorizonal } from "lucide-react";

interface TextInputProps {
  placeholder?: string;
  width?: string;
  value?: string;
  defaultValue?: string;
  onSend: (message: string) => void;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({
  placeholder = "Type a message...",
  defaultValue = "",
  onSend,
  onChange = () => {},
  value,
  disabled = false,
}) => {
  const [inputValue, setInputValue] = useState(defaultValue || value || "");
  const [isFocused, setIsFocused] = useState(false);

  const baseStyles = `p-2 rounded-lg border-2 outline-none w-full placeholder:italic pr-10`;
  const currentStyles = isFocused ? 'border-orange' : 'border-lightgrey/50';

  useEffect(() => {
    if (value !== undefined) {
      setInputValue(value);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (onChange) onChange(newValue);
  };

  const handleSend = () => {
    if (inputValue.trim()) {
      onSend(inputValue.trim());
      setInputValue("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Determine icon color based on whether there's text
  const iconColor = inputValue.trim() ? 'text-orange' : 'text-lightgrey';

  return (
    <div className="relative">
      <input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        className={`${baseStyles} ${currentStyles}`}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      />
      <button
        className={`absolute right-2 top-1/2 -translate-y-1/2 ${iconColor} ${!inputValue.trim() ? 'cursor-default' : 'cursor-pointer'}`}
        onClick={handleSend}
        disabled={!inputValue.trim()}
        aria-label="Send message"
      >
        <SendHorizonal size={20} />
      </button>
    </div>
  );
};

export default TextInput;