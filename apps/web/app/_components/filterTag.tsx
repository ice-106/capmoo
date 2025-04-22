import React from 'react'

interface FilterTagProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}

const FilterTag: React.FC<FilterTagProps> = ({
  children,
  onClick,
  className = '',
}) => {
  return (
    <div
      className={`border-orange text-orange flex cursor-pointer items-center gap-1 rounded-full border px-3 py-1 text-sm ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export default FilterTag
