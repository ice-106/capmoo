import React from "react";

interface TagProps {
  children: React.ReactNode;
  className?: string;
}

const Tag: React.FC<TagProps> = ({ children, className = "" }) => {
  return (
    <div
      className={`px-2 py-1 rounded-full border border-orange text-orange text-sm flex items-center gap-1 ${className}`}
    >
      {children}
    </div>
  );
};
export default Tag;
