'use client'

import React from 'react'
import { useAuth } from 'react-oidc-context'
import { useRouter } from 'next/navigation'
import Header from '~/_components/header'
import VendorFooter from '~/_components/vendor-footer'
import ProfilePhoto from '~/_components/profile-photo'
import IconWithLabel from '~/_components/icon-with-label'
import { PencilLine, Star, BarChart2, Wallet } from 'lucide-react'
import Button from '~/_components/button'

export default function ProfilePage() {
  const auth = useAuth()
  const router = useRouter()
  const username = 'Coconut kitchen'
  const rating = 4.8
  const bookings = 26
  const revenue = 18200

  const activityTiles = [
    {
      label: 'Active',
      bg: 'bg-[#4B4B4B]',
      text: 'text-white',
      onClick: () => router.push('/vendor/activity/active'),
    },
    {
      label: 'Draft',
      bg: 'bg-[#D9D9D9]',
      text: 'text-white',
      onClick: () => router.push('/vendor/activity/draft'),
    },
    {
      label: 'Ended',
      bg: 'bg-[#D9D9D9]',
      text: 'text-white',
      onClick: () => router.push('/vendor/activity/ended'),
    },
    {
      label: '+\nCreate \nNew Activity',
      bg: 'bg-[#EB7926]', // orange-500
      text: 'text-white',
      onClick: () => router.push('/vendor/activity/create'),
    },
  ]

  const signOutRedirect = () => {
    const clientId = '45pi75s2fqmpp08p51pdupv5jc'
    const logoutUri = 'https://capmoo.vercel.app/'
    const cognitoDomain =
      'https://ap-southeast-1kabcq3yw4.auth.ap-southeast-1.amazoncognito.com'
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`
  }

  const handleSignOut = () => {
    auth.removeUser()
    signOutRedirect()
  }

  return (
    <main className='font-poppins flex w-full flex-col justify-between gap-12 pb-12'>
      <Header text='Profile' />
      <div className='flex flex-col gap-4 px-4'>
        {/* Profile Header */}
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
                onClick={() => router.push('/vendor/profile/edit')}
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
            label={rating.toString()}
            color='#F6BF27'
          />
        </div>

        {/* Stats Section */}
        <div className='flex w-full justify-around rounded-lg border border-orange-400 px-4 py-2'>
          <div className='flex flex-col items-center text-center'>
            <Star className='h-5 w-5 text-orange-500' />
            <span className='text-sm font-semibold'>{rating}</span>
            <span className='text-xs'>Avg. Rating</span>
          </div>
          <div className='flex flex-col items-center text-center'>
            <BarChart2 className='h-5 w-5 text-orange-500' />
            <span className='text-sm font-semibold'>{bookings}</span>
            <span className='text-xs'>Bookings This Month</span>
          </div>
          <div className='flex flex-col items-center text-center'>
            <Wallet className='h-5 w-5 text-orange-500' />
            <span className='text-sm font-semibold'>
              {revenue.toLocaleString()}
            </span>
            <span className='text-xs'>Revenue (Baht)</span>
          </div>
        </div>

        {/* Hosted Activities */}
        <div className='mt-6 w-full'>
          <h2 className='mb-4 text-lg font-semibold'>My Hosted Activities</h2>
          <div className='grid grid-cols-2 gap-4'>
            {activityTiles.map((tile, index) => (
              <div
                key={index}
                className={`flex h-28 items-center justify-center whitespace-pre-wrap rounded-xl text-center text-sm font-medium ${tile.bg} ${tile.text}`}
                onClick={tile.onClick}
              >
                {tile.label}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className='flex justify-center'>
        <Button label='Sign out' variant='default' onClick={handleSignOut} />
      </div>

      <VendorFooter />
    </main>
  )
}
