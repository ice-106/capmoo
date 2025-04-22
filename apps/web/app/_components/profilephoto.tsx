'use client'
import React, { useRef, useState, useEffect } from 'react'
import { Pencil } from 'lucide-react'
import Image from 'next/image'
import useBanner from '../hooks/useBanner'
import Cropper from './cropper'

interface ProfilePhotoProps {
  allowEdit?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const defaultProfilePhoto = '/images/default_profile.png'
const sizeClasses = {
  sm: 'w-24 h-24',
  md: 'w-44 h-44',
  lg: 'w-64 h-64',
}

export default function ProfilePhoto({
  allowEdit = false,
  size = 'md',
}: ProfilePhotoProps) {
  const photoInputRef = useRef<HTMLInputElement>(null)
  const { Banner, showBanner, hideBanner } = useBanner()
  const [profilePhoto, setProfilePhoto] = useState('')
  const [croppedPhoto, setCroppedPhoto] = useState('')

  useEffect(() => {
    // Implement later
    fetchProfilePhoto()
  }, [])

  // fetch profile photo
  const fetchProfilePhoto = () => {
    setProfilePhoto('')
  }

  // handle clicking the hidden input button
  const handleClickUpload = () => {
    if (photoInputRef.current) {
      // Scroll to the top of the page
      window.scrollTo({ top: 0, behavior: 'smooth' })
      photoInputRef.current.click()
    }
  }

  // read the upload image and open modal for cropping
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    // Check if the file size exceeds the limit (in bytes)
    const maxSize = 5 * 1024 * 1024 // 5 MB (adjust as necessary)

    if (file) {
      if (file.size > maxSize) {
        alert('File size exceeds the 5 MB limit!')
        // Optionally reset the input value
        event.target.value = ''
        return
      }

      try {
        const reader = new FileReader()
        reader.onload = () => {
          openCropper(reader.result as string)
        }
        reader.readAsDataURL(file)
      } catch (error) {
        console.error(error)
      }
    }

    // Reset the input value to allow uploading the same file again
    if (photoInputRef.current) {
      photoInputRef.current.value = ''
    }
  }

  const openCropper = (image: string) => {
    showBanner({
      content: (
        <div className='flex h-auto w-full flex-col items-center gap-8'>
          <h2 className='text-orange'>Crop your photo</h2>
          <Cropper
            src={image}
            onCropComplete={(croppedPhoto) => {
              // Need to actually record in db later
              setCroppedPhoto(croppedPhoto)
              setProfilePhoto(croppedPhoto)
              hideBanner()
            }}
          />
        </div>
      ),
      size: 'md',
    })
  }

  return (
    <>
      <div className={`relative ${sizeClasses[size]}`}>
        <div className='border-lightgrey flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2'>
          {/* Display profile photo if available */}
          <Image
            src={profilePhoto ? profilePhoto : defaultProfilePhoto}
            alt='Profile'
            width={144}
            height={144}
            className='h-full w-full object-cover'
          />
        </div>
        {allowEdit && (
          <div
            className='bg-orange absolute bottom-0 right-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full p-2'
            onClick={handleClickUpload}
          >
            <Pencil color='white' />
          </div>
        )}
      </div>

      {/* Crop banner */}
      <Banner />

      {/* Hidden File Input */}
      <input
        type='file'
        accept='image/jpeg, image/png, image/jpg'
        className='hidden'
        ref={photoInputRef}
        onChange={handleFileChange}
      />
    </>
  )
}
