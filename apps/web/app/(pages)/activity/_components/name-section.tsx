import React, { useState, useEffect, useRef } from 'react'
import {
  Star,
  MessageSquareText,
  Share2,
  Pocket,
  CalendarClock,
  MapPin,
  Banknote,
} from 'lucide-react'
import BackButton from '~/_components/back-button'
import Gallery from '~/_components/gallery-rect'

interface ImageData {
  src: string
}

interface NameSectionProps {
  images: ImageData[]
  rating: number
  name: string
  date: string
  location: string
  price: string
}

const formatDateTime = (dateString: string): string => {
  if (!dateString) {
    return ''
  }

  const date = new Date(dateString)
  if (isNaN(date.getTime())) {
    return ''
  }

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date)
}

const NameSection: React.FC<NameSectionProps> = ({ ...props }) => {
  const [isSticky, setIsSticky] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Get the scrollable container instead of using window
    const scrollContainer = document.querySelector('.overflow-y-auto')

    if (!scrollContainer) {
      console.error('Scrollable container not found')
      return
    }

    const handleScroll = () => {
      if (containerRef.current) {
        // Get the bounding rectangle relative to the viewport
        const rect = containerRef.current.getBoundingClientRect()

        const shouldStick = rect.top <= -420

        setIsSticky(shouldStick)
      }
    }

    // Add scroll listener to the container, not the window
    scrollContainer.addEventListener('scroll', handleScroll)

    handleScroll()

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleReviewClick = () => {
    console.log('Review clicked')
  }

  const handleSaveClick = () => {
    console.log('Save clicked')
  }

  const handleShareClick = () => {
    console.log('Share clicked')
  }

  return (
    <>
      {isSticky && (
        <div className='absolute left-1/2 top-0 z-50 w-screen -translate-x-1/2 transform bg-white py-3 shadow-md'>
          <div className='mx-auto w-[375px] px-6'>
            <div className='mt-4 flex flex-col gap-y-3'>
              <BackButton />

              <div className='flex justify-between'>
                <span className='flex gap-x-2'>
                  <Star className='text-lemon h-6 w-6' />
                  {props.rating}
                </span>
                <span className='flex gap-x-3'>
                  <MessageSquareText
                    className='text-pumpkin h-6 w-6 cursor-pointer'
                    onClick={handleReviewClick}
                  />
                  <Pocket
                    className='text-pumpkin h-6 w-6 cursor-pointer'
                    onClick={handleSaveClick}
                  />
                  <Share2
                    className='text-pumpkin h-6 w-6 cursor-pointer'
                    onClick={handleShareClick}
                  />
                </span>
              </div>
              <h3>{props.name}</h3>
            </div>
          </div>
        </div>
      )}

      <div
        ref={containerRef}
        className='-mt-20 pb-6'
        style={{ paddingTop: isSticky ? '64px' : '0' }} // Add padding when sticky is active
      >
        <BackButton />
        <Gallery images={props.images} />
        <div className='mt-4 flex flex-col gap-y-3'>
          <div className='flex justify-between'>
            <span className='flex gap-x-2'>
              <Star className='text-lemon h-6 w-6' />
              {props.rating}
            </span>
            <span className='flex gap-x-3'>
              <MessageSquareText
                className='text-pumpkin h-6 w-6 cursor-pointer'
                onClick={handleReviewClick}
              />
              <Pocket
                className='text-pumpkin h-6 w-6 cursor-pointer'
                onClick={handleSaveClick}
              />
              <Share2
                className='text-pumpkin h-6 w-6 cursor-pointer'
                onClick={handleShareClick}
              />
            </span>
          </div>
          <h3>{props.name}</h3>
          <span className='flex gap-x-2'>
            <CalendarClock className='text-darkgrey h-6 w-6' />
            {formatDateTime(props.date)}
          </span>
          <span className='flex gap-x-2'>
            <MapPin className='text-darkgrey h-6 w-6' />
            {props.location}
          </span>
          <span className='flex gap-x-2'>
            <Banknote className='text-darkgrey h-6 w-6' />
            {props.price}
          </span>
        </div>
      </div>
    </>
  )
}

export default NameSection
