'use client'
import { useParams } from 'next/navigation'
import React, { useState } from 'react'
import BackButton from '~/_components/back-button'
import Gallery from '~/_components/gallery-rect'
import FooterTemplate from '~/_components/footer-template'
import FilterTag from '~/_components/filter-tag'
import {
  ChevronDown,
  ChevronUp,
  Pocket,
  MessageCircle,
  Share,
  Star,
} from 'lucide-react'
import Image from 'next/image'
import Footer from '~/_components/footer'

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
      "id": "1",
      "author": "Tung Tung Tung Sahur",
      "activity": "The Sahur at Wat Phra Kaew 🛕✨",
      "location": "Bangkok",
      "price": "100 Baht/person",
      "rating": 3.5,
      "comment": "The experience was nice, but the crowds were overwhelming. It's an interesting activity, but you need to arrive early to avoid long lines. The historical site is beautiful, though, and the guides are knowledgeable. Would recommend if you have some patience with crowds.",
      "images": placeholderImageUrl
    },
    {
      "id": "2",
      "author": "Singha Morzai soi 8",
      "activity": "Siam Amazing Park",
      "location": "Siam, Bangkok",
      "price": "100 Baht/person",
      "rating": 1.2,
      "comment": "Honestly, I was disappointed. The park was underwhelming, and many of the rides were closed. The staff seemed unenthusiastic, and the overall experience didn't feel worth the time. I expected much more excitement from a place like this.",
      "images": placeholderImageUrl
    },
    {
      "id": "3",
      "author": "HumKungLnw",
      "activity": "Safari world - POV - HumKungLnw 😎",
      "location": "Safari World, Bangkok",
      "price": "100 Baht/person",
      "rating": 4.5,
      "comment": "I had a great time at Safari World! The safari tour was exciting, and we got to see a variety of animals up close. The staff was friendly, and the facilities were well maintained. Perfect for animal lovers and families looking to enjoy a day out.",
      "images": placeholderImageUrl
    },
    {
      "id": "4",
      "author": "Siam Tourist",
      "activity": "Sahur pa tour Sea Life Bangkok 🐟🦈🌊",
      "location": "Bangkok",
      "price": "150 Baht/person",
      "rating": 4.0,
      "comment": "Sea Life Bangkok was an educational and fun experience. The tanks are impressive, and you get a close-up view of marine life. The walk-through tunnel is amazing! Would love to visit again, but it's a bit pricey for what it offers.",
      "images": placeholderImageUrl
    },
    {
      "id": "5",
      "author": "ZooFanatic",
      "activity": "Safari World - POV - HumKungLnw 😎",
      "location": "Safari World, Bangkok",
      "price": "200 Baht/person",
      "rating": 5.0,
      "comment": "One of the best experiences I've had in a while! The safari ride was so much fun, and it felt like you were in the middle of the jungle. The animals were active and the views were stunning. Highly recommend this if you're an animal lover!",
      "images": placeholderImageUrl
    },
    {
      "id": "6",
      "author": "AdventureSeeker",
      "activity": "Birthday at Dream World ✨ !!!",
      "location": "Dream World, Bangkok",
      "price": "500 Baht/person",
      "rating": 4.2,
      "comment": "Had an amazing birthday here! The rides were fun, and we had a blast on the roller coasters. The only downside was the crowd, which made waiting in line a bit annoying. But overall, it was a great way to spend the day with friends and family!",
      "images": placeholderImageUrl
    },
    {
      "id": "7",
      "author": "FamilyExplorer",
      "activity": "Playing and Taking Pictures with Horse",
      "location": "Rongbom Rimnam",
      "price": "100 Baht/person",
      "rating": 4.8,
      "comment": "This activity was so peaceful and fun! The horses were calm, and it was great for getting family photos. The staff were friendly and made sure everyone was comfortable. A perfect way to spend an afternoon outdoors. Highly recommend!",
      "images": placeholderImageUrl
    },
    {
      "id": "8",
      "author": "NatureLover",
      "activity": "River Seaweed Harvesting Adventure",
      "location": "Rongbom Rimnam",
      "price": "300 Baht/person",
      "rating": 5.0,
      "comment": "What a unique and fun experience! I loved gliding along the river on the bamboo raft, and learning about the seaweed harvesting technique was so interesting. The nature around us was beautiful, and the guides were very informative. This is a must-do if you're in the area!",
      "images": placeholderImageUrl
    },
    {
      "id": "9",
      "author": "KayakAdventurer",
      "activity": "Kayaking Along Nan River",
      "location": "Nan River, Rongbom Rimnam",
      "price": "350 Baht/person",
      "rating": 4.9,
      "comment": "Absolutely loved kayaking on the Nan River! The water was calm and peaceful, and the views were breathtaking. It was so relaxing, and I spotted some local wildlife along the way. Definitely a great way to escape into nature. I’ll definitely come back!",
      "images": placeholderImageUrl
    }
  ];
  

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
