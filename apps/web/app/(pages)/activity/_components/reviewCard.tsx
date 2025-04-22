import Image from 'next/image'
import { useRouter } from 'next/navigation'
import TextBtn from '../../../_components/textBtn'
import Button from '../../../_components/Button'

interface ReviewCardProps {
  profileImgUrl: string
  userName: string
  reviewText: string
  reviewUrl: string
  leftButton?: { label: string; onClick: () => void }
  rightButton?: { label: string; onClick: () => void }
}

const ReviewCard = ({
  profileImgUrl,
  userName,
  reviewText,
  reviewUrl,
  leftButton,
  rightButton,
}: ReviewCardProps) => {
  const router = useRouter()

  const handleReviewClick = () => {
    console.log('Review clicked')
    router.push(`/reviews/${reviewUrl}`)
  }

  return (
    <div
      className='border-lightgrey w-full cursor-pointer gap-y-4 rounded-lg border p-2'
      // onClick={handleReviewClick}
    >
      <span className='mb-1 flex items-center justify-between font-semibold'>
        <div className='flex items-center gap-x-4'>
          <Image
            src={profileImgUrl}
            alt='Profile Image'
            width={24}
            height={24}
            className='rounded-full'
          />
          {userName}
        </div>
        <TextBtn text='Read' onClick={handleReviewClick} />
      </span>

      <p className='line-clamp-2 overflow-hidden text-ellipsis'>{reviewText}</p>

      {/* New Action Buttons Section */}
      {(leftButton || rightButton) && (
        <div className='mt-4 flex gap-x-4'>
          {leftButton && (
            <Button label={leftButton.label} onClick={leftButton.onClick} />
          )}
          {rightButton && (
            <Button label={rightButton.label} onClick={rightButton.onClick} />
          )}
        </div>
      )}
    </div>
  )
}

export default ReviewCard
