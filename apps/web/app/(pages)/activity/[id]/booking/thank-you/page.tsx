'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import Header from '~/_components/header'
import FooterTemplate from '~/_components/footer-template'
import SubHeaderPayment from '../subheader'
import Button from '~/_components/button'
import { Handshake, BadgeCheck } from 'lucide-react'

const titleData = {
  title: 'Payment Complete',
  icon: Handshake,
  text: `Thank You`,
}

export default function Page() {
  const router = useRouter()

  return (
    <main className='font-poppins flex w-full flex-col justify-between gap-12 pb-12'>
      <Header text='Payment' />
      <div className='flex w-full flex-col justify-center gap-8'>
        <SubHeaderPayment
          currentStep={3}
          title={titleData.title}
          icon={titleData.icon}
          text={titleData.text}
          closingIcon={true}
        />
        <div className='flex justify-center'>
          <BadgeCheck size={256} />
        </div>
      </div>

      <FooterTemplate>
        <Button
          label='Back to menu'
          variant='orange'
          onClick={() => router.push('/discover')}
        />
      </FooterTemplate>
    </main>
  )
}
