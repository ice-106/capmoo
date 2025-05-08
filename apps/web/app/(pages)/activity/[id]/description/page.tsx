'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import NameSection from '../../_components/name-section'
import ReviewCard from '../../_components/review-card'
import TextBtn from '~/_components/text-button'
import FooterTemplate from '~/_components/footer-template'
import Button from '~/_components/button'
import { useAxios } from '~/_lib/axios'

interface ActivityData {
  id: number
  name: string
  description: string
  price: number
  location: string
  startDateTime: string
}

export default function Page() {
  const axios = useAxios()
  const router = useRouter()
  const params = useParams()
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

  // Log the ID from the route
  useEffect(() => {
    const fetchActivityData = async (id: number) => {
      try {
        const response = await axios.get(`/v1/activities/${id}`)
        const data = response.data.data[0]
        setActivityData(data)
      } catch (error) {
        console.error('Error fetching activity data:', error)
      }
    }

    fetchActivityData(activityId)

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

  const mockReviewData = [
    {
      profileImgUrl: '/images/default_profile.png',
      userName: 'TungDudeCarryThailand',
      reviewText:
        'I had an amazing experience at Rongbom Rimnam! The horses were so friendly, and the location was beautiful. It was a great way to spend the day with friends and take some memorable photos. Highly recommend it for anyone looking to enjoy nature and animals!',
      reviewUrl: '7',
    },
    {
      profileImgUrl: '/images/default_profile.png',
      userName: 'KikiLittleWitch',
      reviewText:
        "The river seaweed harvesting was such a fun and unique activity! I loved the bamboo raft ride, and it was so interesting learning about the local techniques. The guides were super knowledgeable and made the experience even better. I can't wait to come back for more adventures!",
      reviewUrl: '8',
    },
    {
      profileImgUrl: '/images/default_profile.png',
      userName: 'MildWannaGoToSleep',
      reviewText:
        'Kayaking along Nan River was so peaceful and relaxing. The scenery was absolutely stunning, and paddling through the calm waters was a perfect way to unwind. Even as a beginner, I felt very comfortable, and the guides made sure we had an awesome time. Definitely worth the experience!',
      reviewUrl: '9',
    },
  ]

  if (!activityData) {
    return <div>Not Found</div>
  }

  return (
    <main className='font-poppins w-full'>
      <NameSection
        images={[{ src: '/images/default_profile.png' }]}
        rating={5}
        name={activityData?.name || ''}
        date={activityData?.startDateTime || ''}
        location={activityData?.location || ''}
        price={activityData?.price?.toString().concat(' THB') || ''}
        onSaveArchive={async () => {
          try {
            await axios.post(`/v1/activities/archive/${activityId}`, {
              activityId: activityId,
              startDateTime: activityData?.startDateTime,
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
          {activityData?.description}
        </section>
        <section className='flex w-full flex-col gap-y-2'>
          <span className='flex w-full justify-between'>
            <h3>Read Reviews</h3>
            <TextBtn
              text='Read all reviews'
              onClick={() => router.push(`/reviews?q=${activityData?.name}`)}
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
        <span className='text-lightgrey text-center text-xs'>
          That&apos;s all for now {':)'}
        </span>
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
                  startDateTime: activityData?.startDateTime,
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
          />
        </div>
      </FooterTemplate>
    </main>
  )
}
