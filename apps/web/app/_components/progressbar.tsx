"use client";

import React from "react";

interface ProgressbarProps {
  totalSteps: number
  currentStep: number
}

const Progressbar: React.FC<ProgressbarProps> = ({ totalSteps, currentStep }) => {

  return (
    <div
      className="flex items-center justify-between w-full px-4 py-2">
      {[...Array(totalSteps)].map((_, index) => (
        <div key = {index}
        className = {`h-2 flex-1 mx-1 rounded-full transition-all duration- 
            ${index <= currentStep - 1 ? 'bg-orange' : 'bg-gray-300'}`}/>
      ))}
    </div>
  );
};

export default Progressbar;