'use client'

import Button from '~/_components/button'

const AddReviewFooter: React.FC<{
  isFormValid: boolean
  handlePost: () => void
}> = ({ isFormValid, handlePost }) => {
  return (
    <nav className='shadow-darkgrey/50 fixed bottom-0 left-0 right-0 z-10 flex h-28 items-start justify-center bg-white p-4 shadow-lg'>
      <div className='w-[375px]'>
        <Button
          label='Post'
          variant='orange'
          onClick={handlePost}
          disabled={!isFormValid}
        />
      </div>
    </nav>
  )
}

export default AddReviewFooter
