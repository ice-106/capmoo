'use client'
import React, { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Header from '~/_components/header'
import SubHeaderPayment from '../subheader'
import FooterTemplate from '~/_components/footer-template'
import Button from '~/_components/button'
import { Banknote, QrCode } from 'lucide-react'

const mockData = {
  name: 'Capmoo Adventure',
  price: 200,
  timeOptions: ['8:00 - 9:00', '9:00 - 10:00'],
}

export default function Page() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const guestNo = searchParams.get('guestNo')
  const qrCodeRef = useRef<any>(null)
  const [timeLeft, setTimeLeft] = useState(300)

  // Countdown effect: decrement time every second
  useEffect(() => {
    if (timeLeft === 0) router.back()

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    // Clear interval when component is unmounted or time reaches 0
    return () => clearInterval(intervalId)
  }, [timeLeft])

  // Format time as mm:ss
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = time % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const getTotalPrice = () => {
    const guestCount = Number(guestNo || 1)
    return guestCount * mockData.price
  }

  const titleData = {
    title: 'Scan the QR Code',
    icon: Banknote,
    text: `${getTotalPrice()} Baht`,
  }

  const handleSaveQR = () => {
    const svgElement = qrCodeRef.current
    if (svgElement) {
      // Serialize the SVG element into a string
      const svgString = new XMLSerializer().serializeToString(svgElement)

      // Create an image element
      const img = new Image()
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml' })
      const svgUrl = URL.createObjectURL(svgBlob)
      img.src = svgUrl

      // Create a canvas to draw the SVG image
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        // Set canvas dimensions to match the SVG image
        canvas.width = img.width
        canvas.height = img.height

        // Draw the SVG image onto the canvas
        ctx?.drawImage(img, 0, 0)

        // Convert the canvas to a PNG image data URL
        const qrImageUrl = canvas.toDataURL('image/png')

        // Create a temporary link element to trigger the download
        const link = document.createElement('a')
        link.href = qrImageUrl
        link.download = 'qr_code.png' // Set the filename for the downloaded image
        link.click() // Trigger the download
      }
    }
  }

  // skip payment
  const magicSkip = () => {
    router.push(`thank-you`)
  }

  return (
    <main className='font-poppins flex w-full flex-col justify-between gap-12 pb-12'>
      <Header text='Payment' />
      <div className='flex w-full flex-col justify-center gap-8'>
        <SubHeaderPayment
          currentStep={2}
          title={titleData.title}
          icon={titleData.icon}
          text={titleData.text}
        />
        <div className='flex justify-center' onClick={magicSkip}>
          <QrCode size={256} ref={qrCodeRef} />
        </div>
        <div className='flex flex-col items-center justify-center'>
          <span className='text-grey'>This QR Code will expires in</span>
          <span className='text-xl font-bold text-red-600'>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>
      <FooterTemplate>
        <div className='flex items-center justify-between gap-4 px-4'>
          <Button label='Back' onClick={() => router.back()} />
          <Button label='Save QR' variant='orange' onClick={handleSaveQR} />
        </div>
      </FooterTemplate>
    </main>
  )
}
