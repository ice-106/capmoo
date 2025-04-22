// components/BackButton.tsx
import React from 'react'
import { useRouter } from 'next/navigation'

const BackButton: React.FC = () => {
  const router = useRouter()

  const handleBack = () => {
    router.back()
  }

  return (
    <button
      onClick={handleBack}
      className='group flex h-12 w-12 items-center justify-center rounded-full border border-gray-500 bg-transparent px-2 py-2 font-semibold transition duration-300 ease-in-out hover:border-white hover:bg-gray-500'
      aria-label='Go back'
      title='Go back'
    >
      <svg
        className='h-6 w-6 text-gray-600 group-hover:text-white'
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='2'
          d='M15 19l-7-7 7-7'
        />
      </svg>
    </button>
  )
}

export default BackButton
