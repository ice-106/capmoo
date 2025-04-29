'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import BackButton from '~/_components/back-button'
import PreviousActivitySelector from './_components/previous-activity'
import Rating from './_components/rating'
import ImageUploader from './_components/image-upload'
import FooterTemplate from '~/_components/footer-template'
import Button from '~/_components/button'

export default function Page() {
  const router = useRouter()
  const [comment, setComment] = useState('')

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
  // TODO : Fetch actual data from database
  type Activity = {
    id: number
    images: { src: string }[]
    name: string
    date: string
    location: string
    price: string
    description: string
  }

  const dataDummy: Activity[] = [
    {
      id: 1,
      images: [
        { src: '/images/default_profile.png' },
        { src: '/images/default_profile.png' },
        { src: '/images/default_profile.png' },
      ],
      name: 'Intania Expo 111',
      date: 'March 28, 2025 - March 30, 2025',
      location: 'Faculty of Engineering Chulalongkorn University',
      price: '200 THB/person',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    },
    {
      id: 2,
      images: [
        { src: '/images/default_profile.png' },
        { src: '/images/default_profile.png' },
        { src: '/images/default_profile.png' },
      ],
      name: 'ISE Open House 2025',
      date: 'Nov 2, 2024',
      location: 'Faculty of Engineering Chulalongkorn University',
      price: '200 THB/person',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    },
  ]

  // TODO: Extract Data from JSON
  const optionsDummy = dataDummy.map((activity) => activity.name)
  const selectedInfo = dataDummy.find((a) => a.name === selectedActivity[0])
  const activityDate = selectedInfo?.date ?? '-'
  const activityLocation = selectedInfo?.location ?? '-'

  const [rating, setRating] = useState(0)
  const isFormValid = selectedActivity.length > 0 && rating > 0
  const handlePost = async () => {
    const selected = dataDummy.find((a) => a.name === selectedActivity[0])
    if (!selected) return
  
    try {
      const response = await fetch('http://localhost:4000/v1/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: rating,
          comment: comment,
          userId: 1, // ใส่ user id จริงจาก auth
          activityId: selected.id,
        }),
      })
  
      if (!response.ok) {
        throw new Error('Failed to post review')
      }
  
      router.push('/reviews')
    } catch (error) {
      console.error('Post error:', error)
      alert('Error posting review')
    }
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
          label='Post'
          variant='orange'
          onClick={handlePost}
          disabled={!isFormValid}
        />
      </FooterTemplate>
      <div className='flex flex-col gap-y-8'>
        <ImageUploader />
        <div className='text-lg font-semibold'>Activity</div>
        <PreviousActivitySelector
          selected={selectedActivity}
          onSelect={handleSelectActivity}
          options={optionsDummy}
          defaultText='Select previous activity'
          activityDate={activityDate}
          activityLocation={activityLocation}
        />
        <Rating rating={rating} setRating={setRating} comment={comment} setComment={setComment}/>
      </div>
    </main>
  )
}
