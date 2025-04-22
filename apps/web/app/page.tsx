'use client'

import React, { useEffect } from 'react'
import { useAuth } from 'react-oidc-context'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import FooterTemplate from './_components/footer-template'

export default function Page() {
  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Only redirect if the user is authenticated
    if (auth.isAuthenticated) {
      router.push('/discover')
    }
  }, [auth.isAuthenticated, router])

  return (
    <main className='font-poppins relative w-full pt-[240px]'>
      {/* Background circle and Logo */}
      <div
        className={`bg-pumpkin-lemon absolute left-[50%] top-[-512px] flex h-[720px] w-[720px] -translate-x-1/2 items-end justify-center rounded-full pb-16`}
      >
        <Image
          src='/images/Logo.png'
          alt='Capmoo'
          width={144}
          height={144}
          className='h-auto w-[144px]'
        />
      </div>

      <div className='flex flex-col gap-12'>
        {/* Title */}
        <div className='flex w-full flex-col items-center gap-4'>
          <h1 className='text-5xl text-black'>Capmoo</h1>
          <span className='text-xs font-semibold'>
            Get started, enhance your travel
          </span>
        </div>

        {/* Buttons */}
        <div className='flex w-full flex-col items-center gap-2'>
          {auth.isLoading ? (
            <div>Loading...</div>
          ) : (
            // Replace with Button component later
            <button
              className='bg-orange w-[200px] rounded-lg px-4 py-2 text-lg font-semibold text-white'
              onClick={() => auth.signinRedirect()}
            >
              Get started
            </button>
          )}

          {auth.error && (
            <div className='text-red text-md'>
              {(auth.error as Error).message}
            </div>
          )}
        </div>
        <FooterTemplate>
          <div className='flex justify-center'>
            <a href='/vendor/auth' className='text-grey underline'>
              vendor portal
            </a>
          </div>
        </FooterTemplate>
      </div>
    </main>
  )
}
