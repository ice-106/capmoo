// components/Button.tsx
import React from 'react'

interface ButtonProps {
  label: string
  onClick?: () => void
  variant?: 'default' | 'orange'
  rounded?: 'lg' | 'sm' | 'full'
  className?: string
  disabled?: boolean
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  variant = 'default',
  rounded = 'full',
  className = '',
  disabled = false,
}) => {
  const baseClasses = 'w-full font-semibold py-2 px-4 border cursor-pointer'

  const variantClasses = {
    default:
      'bg-white hover:bg-orange text-grey hover:text-white border-grey hover:border-transparent',
    orange: 'bg-orange text-white hover:bg-orange/90 border-transparent',
  }

  const roundedClasses = {
    sm: 'rounded-sm',
    lg: 'rounded-lg',
    full: 'rounded-full',
  }

  const combinedClasses = [
    baseClasses,
    variantClasses[variant],
    roundedClasses[rounded],
    className,
  ].join(' ')

  return (
    <button className={combinedClasses} onClick={onClick} disabled={disabled}>
      {label}
    </button>
  )
}

export default Button
