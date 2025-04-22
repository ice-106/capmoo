'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAuth } from 'react-oidc-context'

export default function CallbackPage() {
  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!auth.isLoading && auth.isAuthenticated) {
      router.push('/')
    }
  }, [auth.isLoading, auth.isAuthenticated, router])

  const renderLoader = () => (
    <div className='flex h-full w-full items-center justify-center'>
      <div className='bg-pumpkin-lemon h-[180px] w-[180px] rounded-2xl p-6'>
        <Image
          src='/images/Logo.png'
          width={144}
          height={144}
          alt='Capmoo'
          className='h-full w-full'
        />
      </div>
    </div>
  )

  if (auth.error) return <div>Error: {auth.error.message}</div>
  else return renderLoader()
}
