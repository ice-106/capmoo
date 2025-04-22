import React, { useState } from 'react'
import { Plus, X } from 'lucide-react'
import Image from 'next/image'

const MAX_IMAGES = 10

const ImageUploader: React.FC = () => {
  const [images, setImages] = useState<string[]>([])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const fileArray = Array.from(files).slice(0, MAX_IMAGES - images.length)

    const newImages = fileArray.map((file) => URL.createObjectURL(file))
    setImages((prev) => [...prev, ...newImages])
  }

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className='-mx-6 flex flex-nowrap gap-4 overflow-x-auto px-6 pb-2'>
      {images.map((src, index) => (
        <div key={index} className='relative h-24 w-24 flex-shrink-0'>
          <Image
            src={src}
            alt={`Uploaded ${index}`}
            width={96}
            height={96}
            className='rounded-xl object-cover'
            style={{ width: '100%', height: '100%' }}
          />
          <button
            onClick={() => handleRemoveImage(index)}
            className='absolute right-0 top-0 rounded-full bg-black bg-opacity-50 p-1 text-white'
          >
            <X size={16} />
          </button>
        </div>
      ))}
      {images.length < MAX_IMAGES && (
        <label className='bg-lightgrey hover:lightgrey flex h-24 w-24 flex-shrink-0 cursor-pointer items-center justify-center rounded-xl transition-colors'>
          <Plus className='text-gray-600' />
          <input
            type='file'
            accept='image/*'
            onChange={handleImageUpload}
            className='hidden'
            multiple
          />
        </label>
      )}
    </div>
  )
}

export default ImageUploader
