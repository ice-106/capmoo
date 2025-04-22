'use client'
import { useParams } from 'next/navigation'
import React, { useState } from 'react'
import BackButton from '../../../../_components/BackButton'
import Gallery from '../../../../_components/galleryrect'
import FooterTemplate from '../../../../_components/footerTemplate'
import FilterTag from '../../../../_components/filterTag'
import {
  ChevronDown,
  ChevronUp,
  Pocket,
  MessageCircle,
  Share,
  Star,
} from 'lucide-react'
import Image from 'next/image'
import Footer from '../../../../_components/footer'

export default function ReviewDescriptionPage() {
  const params = useParams()
  const reviewId = params.id as string

  // mock data
  const userProfileUrl = '/images/default_profile.png'
  const placeholderImageUrl = [
    { src: `/images/activity/user/activity_${reviewId}.jpg` },
    { src: '/images/placeholder.png' },
    { src: '/images/placeholder.png' },
  ]

  const mockReviews = [
    {
      id: '1',
      author: 'Tung Tung Tung Sahur',
      activity: 'Wat Phra Kaew',
      location: 'Bangkok',
      price: '200 THB',
      rating: 3.5,
      comment:
        'Tung tung tung tung tunh sahur Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque non.',
      images: placeholderImageUrl,
    },
    {
      id: '2',
      author: 'Singha Morzai soi 8',
      activity: 'Siam Amazing Park',
      location: 'Bangkok',
      price: '300 THB',
      rating: 1.2,
      comment: 'Brombodido Croccodido kod zing kod zad add add',
      images: placeholderImageUrl,
    },
    {
      id: '3',
      author: 'HumKungLnw',
      activity: 'Safari world',
      location: 'Bangkok',
      price: '400 THB',
      rating: 4.5,
      comment:
        'Talalero Tralala Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque non.',
      images: placeholderImageUrl,
    },
  ]

  const getMockReviewData = (id: string) => {
    // find the review match with the ID
    const review = mockReviews.find((review) => review.id === id)
    return review || null
  }

  // state for review data
  const [review, setReview] = useState(getMockReviewData(reviewId))

  // Event handlers for the footer
  const handleSave = () => {
    console.log('Save clicked')
  }

  const handleUpvote = () => {
    console.log('Upvote clicked')
  }

  const handleDownvote = () => {
    console.log('Downvote clicked')
  }

  const handleComment = () => {
    console.log('Comment clicked')
  }

  const handleShare = () => {
    console.log('Share clicked')
  }

  // provide feedback if the review is not found
  if (!review) {
    return (
      <main className='font-poppins flex h-screen w-full flex-col items-center justify-center'>
        {/* transparent header  with back button*/}
        <div className='fixed left-0 right-0 top-0 flex h-24 w-full items-end justify-center p-4'>
          <div className='flex w-[375px] items-center justify-between px-4'>
            <BackButton />
          </div>
        </div>
        <p className='text-gray text-xl'>Review not found</p>
      </main>
    )
  }
  return (
    <main className='font-poppins flex h-screen w-full flex-col items-center'>
      {/* Fixed header - always visible */}
      <div className='fixed left-0 right-0 top-0 z-50 flex h-24 w-full items-end justify-center bg-white p-4'>
        <div className='flex w-[375px] items-center justify-between px-4'>
          <BackButton />
        </div>
      </div>

      {/* Gallery with button */}
      <div className='w-full max-w-[375px] pb-20'>
        <div className='mb-1 w-full'>
          <Gallery images={review.images} />
        </div>
        {/* Content container */}
        <div className='mt-4 flex flex-col gap-y-3'>
          <div className='item-center flex'>
            <div className='flex flex-1 items-center gap-x-2'>
              <Image
                src={userProfileUrl}
                alt='Profile Image'
                width={24}
                height={24}
                className='rounded-full'
              />

              <div className='text-md font-semibold'>{review.author}</div>
            </div>
            <span className='flex gap-x-3'>
              <Star className='text-lemon h-6 w-6' />
              {review.rating}
            </span>
          </div>
          <h3>{review.activity}</h3>
          <div className='flex gap-x-3'>
            <FilterTag>Location: {review.location}</FilterTag>
            <FilterTag>Price: {review.price}</FilterTag>
          </div>
          <div className='text-md border-lightgrey rounded-lg border px-2 py-2'>
            {review.comment}
          </div>
        </div>
      </div>
      {/* Footer section */}
      <FooterTemplate>
        <div className='flex w-full items-center justify-between px-4'>
          {/* Left side for pocket button*/}
          <div
            className='rounded-md p-2'
            style={{ cursor: 'pointer' }}
            onClick={handleSave}
          >
            <Pocket size={24} />
          </div>

          {/* Right side for upvote, comment, and share buttons */}
          <div className='flex gap-x-4'>
            <div
              className='cursor-pointer rounded-md p-2'
              style={{ cursor: 'pointer' }}
              onClick={handleUpvote}
            >
              <ChevronUp size={24} />
            </div>
            <div
              className='cursor-pointer rounded-md p-2'
              style={{ cursor: 'pointer' }}
              onClick={handleDownvote}
            >
              <ChevronDown size={24} />
            </div>
            <div
              className='cursor-pointer rounded-md p-2'
              style={{ cursor: 'pointer' }}
              onClick={handleComment}
            >
              <MessageCircle size={24} />
            </div>
            <div
              className='cursor-pointer rounded-md p-2'
              style={{ cursor: 'pointer' }}
              onClick={handleShare}
            >
              <Share size={24} />
            </div>
          </div>
        </div>
      </FooterTemplate>
    </main>
  )
}
