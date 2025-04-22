import React from 'react'

interface TextBtnProps {
  onClick: () => void
  className?: string
  text: string
}

const TextBtn: React.FC<TextBtnProps> = ({
  onClick,
  className = 'text-xs italic underline text-orange',
  text,
}) => {
  return (
    <button type='button' onClick={onClick} className={className}>
      {text}
    </button>
  )
}

export default TextBtn
