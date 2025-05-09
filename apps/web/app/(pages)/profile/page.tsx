'use client'
import React, { useEffect, useState } from 'react'
import { useAuth } from 'react-oidc-context'
import { useRouter } from 'next/navigation'
import Header from '../../_components/header'
import Footer from '../../_components/footer'
import ProfilePhoto from '../../_components/profile-photo'
import IconWithLabel from '../../_components/icon-with-label'
import Carousel from '../../_components/carousel'
import { Star, PencilLine } from 'lucide-react'
import Button from '../../_components/button'
import { signOutRedirect } from '~/_server/auth'
import { useAxios } from '~/_lib/axios'

const username = 'anonymous user'

export default function ProfilePage() {
  const axios = useAxios()
  const auth = useAuth()
  const router = useRouter()
  const [userRating, setUserRating] = useState(0)
  const [savedActivites, setSavedActivities] = useState([])

  useEffect(() => {
    const fetchSavedActivities = async () => {
      try {
        const response = await axios.get('/v1/activities/archive')
        if (response.data.data.length > 0) {
          const activities = response.data.data.map((activity: any) => ({
            imgUrl: activity.images[0],
            text: activity.name,
            onClickUrl: `/activity/${activity.id}/description`,
          }))
          setSavedActivities(activities)
        }
      } catch (error) {
        console.error('Error fetching saved activities:', error)
      }
    }

    fetchSavedActivities()
  }, [])

  console.log(savedActivites)

  const handleSignOut = async () => {
    auth.removeUser()
    router.push('/')
  }

  return (
    <main className='font-poppins flex w-full flex-col justify-between gap-12 pb-12'>
      <Header text='Profile' />
      <div className='flex flex-col gap-4'>
        <div className='flex justify-between'>
          <div className='flex gap-2'>
            <ProfilePhoto size='sm' />
            <div className='flex flex-col justify-center gap-1'>
              <div>
                {(auth.user?.profile?.['cognito:username'] as string) ||
                  username}
              </div>
              <div
                className='cursor-pointer'
                onClick={() => router.push('/profile/edit')}
              >
                <IconWithLabel
                  icon={PencilLine}
                  label='Edit profile'
                  color='orange'
                />
              </div>
            </div>
          </div>
          <IconWithLabel
            icon={Star}
            label={userRating.toString()}
            color='#F6BF27'
          />
        </div>
        <Carousel header='Saved Activities' images={savedActivites} />
        {/* <Carousel header='Saved Reviews' images={savedReview} /> */}
      </div>
      <div className='flex justify-center'>
        <Button label='Sign out' variant='default' onClick={handleSignOut} />
      </div>

      <Footer />
    </main>
  )
}
