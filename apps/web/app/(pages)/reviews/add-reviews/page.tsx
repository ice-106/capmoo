'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAxios } from '~/_lib/axios'
import { useAuth } from 'react-oidc-context'
import BackButton from '~/_components/back-button'
import PreviousActivitySelector from './_components/previous-activity'
import Rating from './_components/rating'
import ImageUploader from './_components/image-upload'
import FooterTemplate from '~/_components/footer-template'
import Button from '~/_components/button'

export default function Page() {
  const router = useRouter()
  const axios = useAxios()
  const auth = useAuth()

  // Previous Activity Search Drawer
  const [selectedActivity, setSelectedActivity] = useState<string[]>([])
  // Modify dropdown to select only one activity
  const handleSelectActivity = (selectedActivity: string[]) => {
    if (
      selectedActivity.length > 0 &&
      selectedActivity[selectedActivity.length - 1]
    ) {
      setSelectedActivity([
        selectedActivity[selectedActivity.length - 1] as string,
      ])
    } else {
      setSelectedActivity([])
    }
  }

  // Added: State for storing API fetched activities
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [comment, setComment] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([])

  useEffect(() => {
    const fetchActivities = async () => {
      if (!auth.isAuthenticated) {
        return
      }
      setIsLoading(true)
      setError(null)

      try {
        const response = await axios.get('/v1/activities/search')
        const activitiesData = response.data.data.map((activity: any) => ({
          id: activity.id,
          images: activity.images,
          name: activity.name,
          date: activity.date,
          start_date_time: activity.start_date_time,
          location: activity.location,
          price: activity.price,
          description: activity.description,
        }))

        setActivities(activitiesData)
      } catch (error) {
        console.error('Error fetching activities:', error)
        setError('Failed to fetch activities. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchActivities()
  }, [])

  type Activity = {
    id: number
    images?: string[]
    name: string
    date?: string
    start_date_time?: string
    location?: {
      province: string
    }
    price?: string
    description?: string
  }

  // Use API data or fallback to dummy data
  const activeActivities = activities
  const optionsDummy = activeActivities.map((activity) => activity.name)
  const selectedInfo = activeActivities.find(
    (a) => a.name === selectedActivity[0]
  )
  const activityDate =
    selectedInfo?.date ||
    (selectedInfo?.start_date_time
      ? new Date(selectedInfo.start_date_time).toLocaleDateString()
      : '-')
  const activityLocation = selectedInfo?.location?.province || '-'

  const [rating, setRating] = useState(0)
  const isFormValid = selectedActivity.length > 0 && rating > 0

  const handleImageChange = (files: File[]) => {
    setImages(files)
  }

  const handlePost = async () => {
    if (!isFormValid || !selectedInfo) {
      setError('Please select an activity and provide a rating')
      return
    }

    if (!images || images.length === 0) {
      setError('Please add at least one image')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // Step 1: Upload images first
      const imageUrls = await uploadImages(images)
      console.log('Received image URLs:', imageUrls)

      // Step 2: Create the review with the image URLs
      const reviewData = {
        rating: rating,
        comment: comment || '',
        activity_id: selectedInfo.id,
        // Only include Images field if we actually have URLs
        ...(imageUrls.length > 0 && { images: imageUrls }),
      }

      // Log what we're sending
      console.log('Sending review data:', reviewData)

      // Send the review data
      await axios.post(`/v1/activities/${selectedInfo.id}/reviews`, reviewData)

      console.log(
        'Review posted successfully for:',
        selectedActivity[selectedActivity.length - 1],
        'with rating:',
        rating
      )

      // Redirect to reviews page on success
      router.push('/reviews')
    } catch (err: any) {
      console.error('Failed to post review:', err)

      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to post review. Please try again.'
      setError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Update this helper function to handle the actual API response format
  const uploadImages = async (imageFiles: File[]): Promise<string[]> => {
    if (!selectedInfo) {
      throw new Error('No activity selected')
    }

    // Create a FormData object for the image upload
    const formData = new FormData()

    // Append all images to the form data
    imageFiles.forEach((image) => {
      formData.append('images', image)
    })

    // Upload the images to your image upload endpoint
    const response = await axios.post(
      `/v1/activities/${selectedInfo.id}/reviews/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )

    // Log the entire response to see its structure
    console.log('Image upload response:', response.data)

    // Check different possible response formats
    if (response.data) {
      // Format 1: Direct array of URLs
      if (Array.isArray(response.data)) {
        return response.data
      }

      // Format 2: {images: [...]}
      if (response.data.images) {
        return Array.isArray(response.data.images)
          ? response.data.images
          : [response.data.images]
      }

      // Format 3: {data: [...]} or {data: {images: [...]}}
      if (response.data.data) {
        if (Array.isArray(response.data.data)) {
          return response.data.data
        } else if (response.data.data.images) {
          return Array.isArray(response.data.data.images)
            ? response.data.data.images
            : [response.data.data.images]
        }
      }

      // Format 4: {image_urls: [...]}
      if (response.data.image_urls) {
        return Array.isArray(response.data.image_urls)
          ? response.data.image_urls
          : [response.data.image_urls]
      }

      // If we have some data but not in expected format, just log and return empty array
      console.warn(
        'Unexpected response format, using empty array:',
        response.data
      )
      return []
    }

    throw new Error('Failed to upload images: Empty response from server')
  }
  return (
    <main className='font-poppins w-full'>
      <div className='fixed left-0 right-0 top-0 z-10 flex h-24 w-full items-end justify-center bg-white p-4'>
        <div className='flex w-[375px] items-center justify-between px-4'>
          <BackButton />
        </div>
      </div>
      <FooterTemplate>
        <Button
          label={isSubmitting ? 'Posting...' : 'Post'}
          variant='orange'
          onClick={handlePost}
          disabled={!isFormValid || isSubmitting}
        />
      </FooterTemplate>
      <div className='flex flex-col gap-y-8'>
        <ImageUploader onChange={handleImageChange} />{' '}
        <div className='text-lg font-semibold'>Activity</div>
        <PreviousActivitySelector
          selected={selectedActivity}
          onSelect={handleSelectActivity}
          options={optionsDummy}
          defaultText={
            isLoading ? 'Loading activities...' : 'Select previous activity'
          }
          activityDate={activityDate}
          activityLocation={activityLocation}
        />
        <Rating rating={rating} setRating={setRating} />
        <div className='flex flex-col gap-y-2'>
          <div className='text-lg font-semibold'>Comment</div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder='Add your comment...'
            maxLength={256}
            className='bg-lightgrey h-32 rounded-lg px-4 py-2 text-left align-text-top placeholder:italic'
          />
        </div>
      </div>
    </main>
  )
}
