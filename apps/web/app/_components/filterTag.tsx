import React from "react";

interface FilterTagProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}

const FilterTag: React.FC<FilterTagProps> = ({
  children,
  onClick,
  className = "",
}) => {
  return (
    <div 
      className={`px-3 py-1 rounded-full border border-orange text-orange text-sm flex items-center gap-1 cursor-pointer ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default FilterTag;