// components/ToggleButton.tsx
import React from 'react'

interface ToggleButtonProps {
  toggle: boolean
  onToggleChange: (toggle: string) => void
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
  toggle,
  onToggleChange,
}) => {
  const isChecked = toggle

  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newToggle = event.target.checked ? 'th' : 'en'
    onToggleChange(newToggle)
  }

  return (
    <label className='mb-5 inline-flex cursor-pointer items-center'>
      <span
        className={`me-3 text-sm font-medium ${isChecked ? 'text-grey' : 'text-orange'}`}
      >
        EN
      </span>
      <label htmlFor={toggle.toString()} />
      <input
        type='checkbox'
        value=''
        className='peer sr-only'
        checked={isChecked}
        onChange={handleToggle}
      />
      <div className='relative h-6 w-11 rounded-full bg-slate-100 transition-colors duration-300'>
        <img
          src={
            isChecked
              ? 'https://flagcdn.com/20x15/th.png'
              : 'https://flagcdn.com/20x15/us.png'
          }
          alt={isChecked ? 'Thailand Flag' : 'USA Flag'}
          className={`absolute start-[2px] top-[2px] h-5 w-5 rounded-full transition-all ${isChecked ? 'translate-x-full rtl:-translate-x-full' : ''}`}
        />
      </div>
      <span
        className={`ms-3 text-sm font-medium ${isChecked ? 'text-orange' : 'text-grey'}`}
      >
        TH
      </span>
    </label>
  )
}

export default ToggleButton
