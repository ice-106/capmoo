import React from "react";

interface TextBoxProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
}

const TextBox: React.FC<TextBoxProps> = ({
  placeholder = "",
  value,
  onChange,
  maxLength,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="flex flex-col gap-y-2 border-0">
      <textarea
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className="px-4 py-2 rounded-lg bg-lightgrey h-32 align-text-top text-left"
      />
    </div>
  );
};

export default TextBox;