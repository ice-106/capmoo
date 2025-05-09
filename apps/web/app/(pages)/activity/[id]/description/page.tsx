'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import NameSection from '../../_components/name-section'
import ReviewCard from '../../_components/review-card'
import TextBtn from '~/_components/text-button'
import FooterTemplate from '~/_components/footer-template'
import Button from '~/_components/button'
import { useAxios } from '~/_lib/axios'
import { useAuth } from 'react-oidc-context'

interface ActivityData {
  id: number
  name: string
  description: string
  price: number
  location: {
    province: string
  }
  start_date_time: string
  images: string[]
}

export default function Page() {
  const axios = useAxios()
  const router = useRouter()
  const params = useParams()
  const auth = useAuth()
  const activityId = parseInt(params.id as string, 10)
  const [activityData, setActivityData] = useState<ActivityData | null>(null)
  const [isSavedToSchedule, setIsSavedToSchedule] = useState(false)
  const [isSavedToArchive, setIsSavedToArchive] = useState(false)
  const [reviews, setReviews] = useState<
    | {
        profileImgUrl: string
        userName: string
        reviewText: string
        reviewUrl: string
      }[]
    | []
  >([])

  console.log(activityData)

  // Check if user has scheduled or archived this activity
  useEffect(() => {
    const fetchActivityData = async () => {
      try {
        const response = await axios.get(`/v1/activities/${activityId}`)
        setActivityData(response.data.data[0])
      } catch (error) {
        console.error('Error fetching activity data:', error)
      }
    }

    fetchActivityData()

    const checkUserStatus = async () => {
      try {
        // Check scheduled activities
        const scheduledResponse = await axios.get('/v1/activities/schedule')
        if (scheduledResponse.data?.data) {
          const isInSchedule = scheduledResponse.data.data.some(
            (activity: any) => activity.id === activityId
          )
          setIsSavedToSchedule(isInSchedule)
        }

        // Check archived activities
        const archivedResponse = await axios.get('/v1/activities/archive')
        if (archivedResponse.data?.data) {
          const isInArchive = archivedResponse.data.data.some(
            (activity: any) => activity.id === activityId
          )
          setIsSavedToArchive(isInArchive)
        }
      } catch (error) {
        console.error('Error fetching activity data:', error)
      }
    }

    checkUserStatus()

    const fetchSavedActivities = async () => {
      try {
        const response = await axios.get('/v1/activities/schedule')
        const savedActivities = response.data.data.map(
          (activity: { id: number }) => activity.id
        )
        setIsSavedToSchedule(savedActivities.includes(activityId))
      } catch (error) {
        console.error('Error fetching saved activities:', error)
      }
    }

    fetchSavedActivities()

    const fetchSavedActivitiesArchive = async () => {
      try {
        const response = await axios.get('/v1/activities/archive')
        const savedActivities = response.data.data.map(
          (activity: { id: number }) => activity.id
        )
        setIsSavedToArchive(savedActivities.includes(activityId))
      } catch (error) {
        console.error('Error fetching saved activities:', error)
      }
    }

    fetchSavedActivitiesArchive()

    const fetchReviews = async () => {
      try {
        const response = await axios.get(`/v1/activities/${activityId}/reviews`)
        const reviewsData = response.data.data.map((review: any) => ({
          profileImgUrl: '/images/default_profile.png',
          userName: review.user.name,
          reviewText: review.comment,
          reviewUrl: review.id,
        }))
        setReviews(reviewsData)
      } catch (error) {
        console.error('Error fetching reviews:', error)
      }
    }

    fetchReviews()
  }, [activityId])

  const handleBooking = () => {
    console.log('Book clicked')
    router.push(`/activity/${activityId}/booking`)
  }

  if (!activityData) {
    return <div>Not Found</div>
  }

  return (
    <main className='font-poppins w-full'>
      <NameSection
        images={activityData.images.map((img) => ({ src: img }))}
        rating={5}
        name={activityData?.name || ''}
        date={activityData?.start_date_time || ''}
        location={activityData?.location.province || ''}
        price={activityData?.price?.toString().concat(' THB') || ''}
        onSaveArchive={async () => {
          try {
            await axios.post(`/v1/activities/archive/${activityId}`, {
              activityId: activityId,
              startDateTime: activityData?.start_date_time,
            })
            setIsSavedToArchive(true)
          } catch (error) {
            console.error('Error saving activity:', error)
          }
        }}
      />
      <div className='mb-8 flex w-full flex-col gap-y-8'>
        <section className='border-lightgrey w-full rounded-lg border p-2'>
          <b>Description</b> <br />
          {activityData.description}
        </section>
        <section className='flex w-full flex-col gap-y-2'>
          <span className='flex w-full justify-between'>
            <h3>Read Reviews ({reviews.length})</h3>
            <TextBtn
              text='Read all reviews'
              onClick={() => router.push(`/reviews?q=${activityId}`)}
            />
          </span>
          {reviews.map((review, index) => (
            <ReviewCard
              key={index}
              profileImgUrl={review.profileImgUrl}
              userName={review.userName}
              reviewText={review.reviewText}
              reviewUrl={review.reviewUrl}
            />
          ))}
        </section>

        {reviews.length > 0 && (
          <span className='text-lightgrey text-center text-xs'>
            That&apos;s all for now {':)'}
          </span>
        )}
      </div>

      <FooterTemplate>
        <div className='flex gap-x-4'>
          <Button
            disabled={isSavedToSchedule}
            label='Save to Schedule'
            variant='default'
            rounded='lg'
            onClick={async () => {
              try {
                await axios.post(`/v1/activities/schedule/${activityId}`, {
                  activityId: activityId,
                  startDateTime: activityData?.start_date_time,
                })
                setIsSavedToSchedule(true)
              } catch (error) {
                console.error('Error saving activity:', error)
              }
            }}
          />
          <Button
            label='Book Now'
            variant='orange'
            rounded='lg'
            onClick={handleBooking}
            // disabled={isSaving}
          />
        </div>

        {/* Archive button shown below the main buttons */}
        {/* <div className='mt-2 w-full text-center'>
          <TextBtn
            text={isArchived ? 'Unarchive Activity' : 'Archive Activity'}
            onClick={async () => {
              try {
                if (isSavedToArchive) {
                  await axios.delete(`/v1/activities/archive/${activityId}`)
                  setIsSavedToArchive(false)
                } else {
                  await axios.post(`/v1/activities/archive/${activityId}`, {
                    activityId: activityId,
                    startDateTime: activityData?.startDateTime,
                  })
                  setIsSavedToArchive(true)
                }
              } catch (error) {
                console.error('Error saving activity:', error)
              }
            }}
            className='text-sm text-gray-500'
          />
        </div> */}
      </FooterTemplate>
    </main>
  )
}
