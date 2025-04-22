'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import FooterTemplate from '~/_components/footer-template'
import Button from '~/_components/button'
import BackButton from '~/_components/back-button'
import NameSection from '~/(pages)/activity/_components/name-section'

const dummyActivity = [
  'Super marathon',
  'Protest - block roads',
  'Horse riding',
]

const dummyImg = [
  '/images/activity/vendor/activity_7.jpg',
  '/images/activity/vendor/activity_8.jpg',
  '/images/activity/vendor/activity_9.jpeg',
]

export default function Page() {
  const router = useRouter()
  const params = useParams()
  const activityId = params.id as string

  // We could use this state for real API data
  // const [activityData, setActivityData] = useState(null);

  // Log the ID from the route
  useEffect(() => {
    console.log('Activity ID from route:', activityId)

    // In a real scenario, we would fetch data based on the ID
    // fetchActivityData(activityId).then(data => setActivityData(data));
    // For now, we'll continue using mock data
  }, [activityId])

  const handlePost = () => {
    console.log('Activity Posted')
    router.push(`/vendor/activity`)
  }

  // Use the route ID in the mock data
  const mockData = {
    id: activityId,
    images: [
      { src: dummyImg[Number(activityId) - 1] || '/images/placeholder.png' },
      { src: '/images/placeholder.png' },
      { src: '/images/placeholder.png' },
    ],
    rating: 4.5,
    name: dummyActivity[Number(activityId) - 1] || 'Capmoo',
    date: 'April 24, 2025',
    location: 'Bangkok',
    price: '200 THB/person',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. \
    Cras ligula augue, rutrum eu nunc vel, aliquam sodales nulla. Suspendisse in mauris ut lorem maximus gravida vel eu ex.\
    Proin pulvinar arcu pharetra dui mollis, eget hendrerit ligula iaculis. Ut ut lectus vulputate odio bibendum fringilla dapibus ut arcu. \
    Vivamus porta ex at congue hendrerit. Donec tellus est, pellentesque a dolor vitae, aliquam gravida lacus. Curabitur sapien ligula,\
    imperdiet id nisl non, dignissim dictum justo. Aliquam mattis consectetur magna consectetur varius. Class aptent taciti sociosqu ad\
    litora torquent per conubia nostra, per inceptos himenaeos. Morbi non commodo metus, vel sodales enim. Suspendisse at ultricies purus.',
  }

  return (
    <main className='font-poppins w-full'>
      <div className='fixed left-0 right-0 top-0 z-10 flex h-24 w-full items-end justify-center bg-white p-4'>
        <div className='flex w-[375px] items-center justify-between px-4'>
          <BackButton />
        </div>
      </div>
      <NameSection
        images={mockData.images}
        rating={mockData.rating}
        name={mockData.name}
        date={mockData.date}
        location={mockData.location}
        price={mockData.price}
      />
      <div className='border-grey mb-4 w-[130px] rounded-lg border-2 bg-[#D9D9D9] px-2'>
        Status: Draft
      </div>
      <div className='mb-8 flex w-full flex-col gap-y-8'>
        <section className='border-lightgrey w-full rounded-lg border p-2'>
          <b>Description</b> <br />
          {mockData.description}
        </section>
      </div>
      <FooterTemplate>
        <div className='flex gap-x-4'>
          <Button
            label='Delete'
            variant='default'
            rounded='lg'
            onClick={() => console.log('Delete')}
          />
          <Button
            label='Edit'
            variant='default'
            rounded='lg'
            onClick={() => {
              console.log('Edit')
              router.push('/vendor/activity/create')
            }}
          />
          <Button
            label='Post'
            variant='orange'
            rounded='lg'
            onClick={handlePost}
          />
        </div>
      </FooterTemplate>
    </main>
  )
}
