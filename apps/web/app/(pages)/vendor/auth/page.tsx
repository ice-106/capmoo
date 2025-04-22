'use client'
import React, { useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import FooterTemplate from '~/_components/footer-template'
import TextBox from '~/_components/text-box'
import Button from '~/_components/button'

export default function Page() {
  const router = useRouter()
  const vendorID = useRef<HTMLInputElement>(null)
  const password = useRef<HTMLInputElement>(null)

  const handleVendorLogin = () => {
    if (!vendorID.current || !password.current) return

    if (
      vendorID.current.value !== 'capmoo_meth' ||
      password.current.value !== '12345'
    ) {
      vendorID.current.value = ''
      password.current.value = ''
      alert('Incorrect information')
      return
    }

    router.push('/vendor/activity')
  }

  return (
    <main className='font-poppins relative flex w-full flex-col justify-between gap-12 pb-12 pt-[240px]'>
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
      <div className='flex w-full flex-col items-center gap-4 text-center'>
        <h1 className='text-5xl text-black'>Vendor Portal</h1>
        <span className='text-xs font-semibold'>
          <span className='font-normal'>
            become a vendor by contacting us via
          </span>
          <br />
          admin@capmoo.com
        </span>
      </div>
      <div className='grid w-full grid-cols-[2fr,4fr] items-center justify-center gap-4'>
        Vendor ID
        <TextBox ref={vendorID} placeholder='vendor Id' variant='light' />
        Password
        <TextBox
          ref={password}
          placeholder='*********'
          type='password'
          variant='light'
        />
      </div>
      <div className='px-8'>
        <Button label='Submit' variant='orange' onClick={handleVendorLogin} />
      </div>
      <FooterTemplate>
        <div className='flex justify-center'>
          <a href='/' className='text-grey underline'>
            back
          </a>
        </div>
      </FooterTemplate>
    </main>
  )
}
