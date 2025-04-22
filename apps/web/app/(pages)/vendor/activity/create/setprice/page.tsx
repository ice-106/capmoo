'use client'
import React, { useState, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Header from '~/_components/header'
import FooterTemplate from '~/_components/footer-template'
import Button from '~/_components/button'
import TextBox from '~/_components/text-box'
import Dropdown from '~/_components/dropdown'
import { MapPin } from 'lucide-react'
import ImageUploader from '~/(pages)/reviews/add-reviews/_components/image-upload'
import SubHeaderPayment from '~/(pages)/activity/[id]/booking/subheader'

const mockData = {
  name: 'Capmoo Adventure',
  price: 200,
  paymentOptions: ['Credit Card', 'PromptPay', 'Mobile Banking', 'E-Wallet'],
}

const titleData = {
  title: 'Let’s set up your activity!',
  icon: MapPin,
  text: mockData.name,
}

export default function Page() {
  const router = useRouter()
  const pathname = usePathname()
  const price = useRef<HTMLInputElement>(null)
  const description = useRef<HTMLInputElement>(null)
  const guestNo = useRef<HTMLInputElement>(null)
  const date = useRef<HTMLInputElement>(null)
  const [paymentSelected, setPaymentSelected] = useState<string[]>([])

  const handleClickPost = () => {
    router.push(`/vendor/activity/create/thank-you`)
  }

  const handleClickBack = () => {
    router.back()
  }

  const handleSelectPayment = (newSelected: string[]) => {
    const selectedPayment =
      newSelected.length === 2 ? newSelected[1] : newSelected[0]
    setPaymentSelected(selectedPayment ? [selectedPayment] : [])
  }

  return (
    <main className='font-poppins flex w-full flex-col justify-between gap-12 pb-12'>
      <Header text='Let’s set up your activity!' />
      <SubHeaderPayment
        currentStep={2}
        title={titleData.title}
        icon={titleData.icon}
        text={titleData.text}
      />
      <div className='flex w-full flex-col justify-center gap-8'>
        <div className='flex flex-col justify-center gap-4'>
          <h2>Pricing Details</h2>
          <div className='grid w-full grid-cols-[2fr,4fr] items-center justify-center gap-4'>
            Price
            <TextBox ref={price} textSize='small' placeholder='xxx Baht' />
            Payment Method
            <Dropdown
              selected={paymentSelected}
              onSelect={handleSelectPayment}
              options={mockData.paymentOptions}
              defaultText='select methods'
            />
          </div>
          <h2>Upload Images</h2>
          <div className='flex flex-col gap-y-8'>
            <ImageUploader />
          </div>
        </div>
      </div>
      <FooterTemplate>
        <div className='flex items-center justify-between gap-4 px-4'>
          <Button label='Back' onClick={handleClickBack} />
          <Button label='Post' variant='orange' onClick={handleClickPost} />
        </div>
      </FooterTemplate>
    </main>
  )
}
