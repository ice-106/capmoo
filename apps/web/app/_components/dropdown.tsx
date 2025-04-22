'use client'
import React, { useState, useCallback, useRef, useEffect } from 'react'
import { ChevronDown, ChevronUp, Square, SquareCheck } from 'lucide-react'

interface DropdownProps {
  selected: string[]
  onSelect: (selected: string[]) => void
  defaultText: string
  options: string[]
}

const Dropdown = ({
  selected,
  onSelect,
  defaultText,
  options,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [hover, setHover] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Toggle the option in the selected array
  const handleSelectOption = useCallback(
    (option: string) => {
      const newSelected = selected.includes(option)
        ? selected.filter((item) => item !== option)
        : [...selected, option]

      onSelect(newSelected)
    },
    [selected, onSelect]
  )

  return (
    <div ref={dropdownRef} className='relative select-none'>
      <div
        className={`text-caption flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg border-2 px-[12px] py-1 transition-all ${isOpen || hover ? 'bg-orange text-white' : 'text-orange bg-white'} ${isOpen || hover ? 'hover:bg-orange' : 'hover:bg-gray-100'} active:bg-pumpkin active:border-pumpkin`}
        onClick={() => setIsOpen((prev) => !prev)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <span className='overflow-hidden text-ellipsis whitespace-nowrap'>
          {selected.length > 0 ? selected.join(', ') : defaultText}
        </span>
        {isOpen ? (
          <ChevronUp className='flex-shrink-0' />
        ) : (
          <ChevronDown className='flex-shrink-0' />
        )}
      </div>

      {isOpen && (
        <div className='absolute left-0 top-full z-10 mt-1 max-h-32 w-full overflow-y-auto rounded-lg border-2 border-t-0 bg-white'>
          {options.map((option, index) => (
            <div
              key={index}
              className='flex cursor-pointer gap-2 rounded-lg bg-white px-4 py-2 hover:bg-gray-100'
              onClick={(e) => {
                e.stopPropagation() // Prevent closing the dropdown when clicking an option
                handleSelectOption(option)
              }}
            >
              {selected.includes(option) ? (
                <SquareCheck color='orange' />
              ) : (
                <Square />
              )}
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dropdown
