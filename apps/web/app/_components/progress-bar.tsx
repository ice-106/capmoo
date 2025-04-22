'use client'

import React from 'react'

interface ProgressbarProps {
  totalSteps: number
  currentStep: number
}

const Progressbar: React.FC<ProgressbarProps> = ({
  totalSteps,
  currentStep,
}) => {
  return (
    <div className='flex w-full items-center justify-between px-4 py-2'>
      {[...Array(totalSteps)].map((_, index) => (
        <div
          key={index}
          className={`mx-1 h-2 flex-1 rounded-full transition-all duration-200 ${index <= currentStep - 1 ? 'bg-orange' : 'bg-grey'}`}
        />
      ))}
    </div>
  )
}

export default Progressbar
