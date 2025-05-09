'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect, act, Suspense } from 'react'
import SearchBar from '../../_components/search-bar'
import HeaderwithIcon from '../../_components/header-with-icon'
import Footer from '../../_components/footer'
import { CirclePlus } from 'lucide-react'
import Masonry from '../../_components/masonry'
import { useAxios } from '~/_lib/axios'
import { useAuth } from 'react-oidc-context'

// This interface matches the review DTO from your backend
interface Review {
  id: number
  created_at: string
  updated_at: string | null
  rating: number
  comment: string
  images: string[]
  activity_id: number
  activity: {
    id: number
    name: string
    image_url?: string // Optional since it might not be present in all responses
  }
}

export default function Page() {
  return (
    <Suspense>
      <ReviewPage />
    </Suspense>
  )
}

function ReviewPage() {
  const router = useRouter()
  const axios = useAxios()
  const auth = useAuth()
  const searchParams = useSearchParams()

  const activityId = searchParams.get('q') || null

  const [searchQuery, setSearchQuery] = useState('')
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch reviews from API
  // Modify the useEffect dependency array to avoid too many rerenders
  // This is for a component that needs reviews for a specific activity
  useEffect(() => {
    const fetchActivityReviews = async () => {
      if (!auth.isAuthenticated) {
        return
      }

      console.log()
      setIsLoading(true)
      setError(null)

      try {
        // Use the correct endpoint with the activityId parameter

        const urlPath =
          activityId === null
            ? '/v1/reviews'
            : `/v1/activities/${activityId}/reviews`

        const response = await axios.get(urlPath)

        if (!response.data || !response.data.data) {
          throw new Error('Invalid response format')
        }

        setReviews(response.data.data)
      } catch (err: any) {
        console.error(`Error fetching reviews for activity ${activityId}:`, err)
        setError(err.message || 'Failed to load reviews')

        setReviews([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchActivityReviews()
  }, [activityId, auth.isAuthenticated])

  // Convert reviews to the format expected by the Masonry component
  const reviewItems = reviews.map((review) => ({
    id: review.id.toString(),
    imgUrl: review.images?.[0] || '/images/review-placeholder.jpg',
    text: review.activity?.name || 'Unknown Activity',
    onClickUrl: `/reviews/description/${review.id}?q=${review.activity_id}`,
  }))

  // filter reviews based on search query
  const filteredReviews = searchQuery
    ? reviewItems.filter((item) =>
        item.text.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : reviewItems

  return (
    <main className='font-poppins w-full'>
      <HeaderwithIcon
        text='Reviews'
        rightIcon={
          <div onClick={() => router.push('/reviews/add-reviews')}>
            <CirclePlus size={24} color='white' />
          </div>
        }
      />
      <div className='flex items-center justify-center px-4 pt-4'>
        <SearchBar
          placeholder='Search reviews...'
          value={searchQuery}
          onChange={(value: string) => setSearchQuery(value)}
          onSearch={() =>
            console.log('Search triggered with query:', searchQuery)
          }
          width='100%'
          enableDrawer={false}
        />
      </div>

      <div className='mt-4 px-4'>
        {/* show search results */}
        {searchQuery && (
          <div className='flex items-center justify-between'>
            <p>Search results for : &quot;{searchQuery}&quot;</p>
            <button
              className='text-orange text-xs italic underline'
              onClick={() => setSearchQuery('')}
            >
              Clear
            </button>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className='py-12 text-center'>
            <p className='text-grey'>Loading reviews...</p>
          </div>
        )}

        {/* Error state */}
        {!isLoading && error && (
          <div className='py-12 text-center'>
            <p className='text-red-500'>{error}</p>
            <button
              className='text-orange mt-2 text-sm underline'
              onClick={() => router.refresh()}
            >
              Try again
            </button>
          </div>
        )}

        {/* Masonry layout for reviews */}
        {!isLoading && !error && filteredReviews.length > 0 ? (
          <div className='mt-4'>
            <Masonry images={filteredReviews} />
          </div>
        ) : !isLoading && !error ? (
          <div className='py-12 text-center'>
            <h3 className='text-grey'>No reviews found</h3>
          </div>
        ) : null}
      </div>
      <Footer />
    </main>
  )
}
