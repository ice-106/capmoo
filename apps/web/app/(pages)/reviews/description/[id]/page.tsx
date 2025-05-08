'use client'
import { useParams, useSearchParams } from 'next/navigation'
import React, { useState, useEffect } from 'react'
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
import { useAxios } from '~/_lib/axios'
import { useAuth } from 'react-oidc-context'

// Define interface for review data
interface ReviewData {
  id: number;
  created_at: string;
  updated_at: string | null;
  rating: number;
  comment: string;
  images: string[];
  user_id: number;
  user: {
    id: number;
    name: string;
    email: string;
    profile_image_url?: string;
  };
  activity_id: number;
  activity: {
    id: number;
    name: string;
    description: string;
    start_date_time: string;
    end_date_time: string;
    price: number;
    location: {
      province: string;
    };
  };
}

export default function ReviewDescriptionPage() {
  const params = useParams()
  const axios = useAxios()
  const auth = useAuth()
  const searchParams = useSearchParams()
  
  const activityId = searchParams.get('q') || null
  
  const reviewId = params.id as string
  
  const [review, setReview] = useState<ReviewData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUpvoted, setIsUpvoted] = useState(false)
  const [isDownvoted, setIsDownvoted] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  // Fetch review data from API
  useEffect(() => {
    if (!auth.isAuthenticated) return;

    const fetchReviewData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`/v1/activities/${activityId}/reviews/${reviewId}`);
        if (response.data?.data) {
          setReview(response.data.data);
        } else {
          setError("Review not found");
        }
      } catch (err: any) {
        console.error('Error fetching review:', err);
        setError(err.response?.data?.message || "Failed to load review");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviewData();
  }, [reviewId, auth.isAuthenticated]);

  // Event handlers for the footer actions
  const handleSave = () => {
    setIsSaved(!isSaved);
    console.log('Save clicked');
  }

  const handleUpvote = () => {
    if (isDownvoted) {
      setIsDownvoted(false);
    }
    setIsUpvoted(!isUpvoted);
    console.log('Upvote clicked');
  }

  const handleDownvote = () => {
    if (isUpvoted) {
      setIsUpvoted(false);
    }
    setIsDownvoted(!isDownvoted);
    console.log('Downvote clicked');
  }

  const handleComment = () => {
    console.log('Comment clicked');
  }

  const handleShare = () => {
    // Copy the current page URL to clipboard
    navigator.clipboard.writeText(window.location.href)
      .then(() => alert("Link copied to clipboard!"))
      .catch(err => console.error('Failed to copy link: ', err));
  }

  // Loading state
  if (isLoading) {
    return (
      <main className='font-poppins flex h-screen w-full flex-col items-center justify-center'>
        {/* Fixed header for back button */}
        <div className='fixed left-0 right-0 top-0 z-50 flex h-24 w-full items-end justify-center bg-white p-4'>
          <div className='flex w-[375px] items-center justify-between px-4'>
            <BackButton />
          </div>
        </div>
        <p className='text-gray-600'>Loading review...</p>
      </main>
    )
  }

  // Error state
  if (error || !review) {
    return (
      <main className='font-poppins flex h-screen w-full flex-col items-center justify-center'>
        <div className='fixed left-0 right-0 top-0 z-50 flex h-24 w-full items-end justify-center bg-white p-4'>
          <div className='flex w-[375px] items-center justify-between px-4'>
            <BackButton />
          </div>
        </div>
        <p className='text-red-500'>{error || "Review not found"}</p>
      </main>
    )
  }

  // Format images for gallery component
  const galleryImages = review.images.map(url => ({ src: url }));

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
          <Gallery images={galleryImages.length > 0 ? galleryImages : [{ src: '/images/default_profile.png' }]} />
        </div>
        {/* Content container */}
        <div className='mt-4 flex flex-col gap-y-3'>
          <div className='item-center flex'>
            <div className='flex flex-1 items-center gap-x-2'>
              <Image
                src={review.user?.profile_image_url || '/images/default_profile.png'}
                alt='Profile Image'
                width={24}
                height={24}
                className='rounded-full'
                unoptimized={true}
              />

              <div className='text-md font-semibold'>{review.user?.name || "Anonymous"}</div>
            </div>
            <span className='flex gap-x-3'>
              <Star className='text-lemon h-6 w-6' />
              {review.rating}
            </span>
          </div>
          <h3>{review.activity.name}</h3>
          <div className='flex gap-x-3'>
            <FilterTag>Location: {review.activity.location?.province || "Unknown"}</FilterTag>
            <FilterTag>Price: {review.activity.price} THB</FilterTag>
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
            className={`rounded-md p-2 ${isSaved ? 'text-blue-500' : ''}`}
            style={{ cursor: 'pointer' }}
            onClick={handleSave}
          >
            <Pocket size={24} />
          </div>

          {/* Right side for upvote, comment, and share buttons */}
          <div className='flex gap-x-4'>
            <div
              className={`cursor-pointer rounded-md p-2 ${isUpvoted ? 'text-green-500' : ''}`}
              onClick={handleUpvote}
            >
              <ChevronUp size={24} />
            </div>
            <div
              className={`cursor-pointer rounded-md p-2 ${isDownvoted ? 'text-red-500' : ''}`}
              onClick={handleDownvote}
            >
              <ChevronDown size={24} />
            </div>
            <div
              className='cursor-pointer rounded-md p-2'
              onClick={handleComment}
            >
              <MessageCircle size={24} />
            </div>
            <div
              className='cursor-pointer rounded-md p-2'
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