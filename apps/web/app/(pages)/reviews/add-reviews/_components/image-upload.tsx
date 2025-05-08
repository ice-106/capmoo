import React, { useState } from 'react'
import { Plus, X } from 'lucide-react'
import Image from 'next/image'

const MAX_IMAGES = 10

interface ImageUploaderProps {
  onChange?: (files: File[]) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onChange }) => {
  const [images, setImages] = useState<string[]>([])
  const [fileList, setFileList] = useState<File[]>([])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    // Limit to MAX_IMAGES
    const fileArray = Array.from(files).slice(0, MAX_IMAGES - images.length)
    
    // Create URL previews
    const newImages = fileArray.map((file) => URL.createObjectURL(file))
    
    // Update state
    setImages((prev) => [...prev, ...newImages])
    
    // Store the actual File objects
    const updatedFiles = [...fileList, ...fileArray]
    setFileList(updatedFiles)
    
    // Notify parent component of the change
    if (onChange) {
      onChange(updatedFiles)
    }
  }

  const handleRemoveImage = (index: number) => {
    // Revoke object URL to prevent memory leaks
    const imageUrl = images[index];
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl)
    }
    
    // Remove image from preview array
    setImages((prev) => prev.filter((_, i) => i !== index))
    
    // Remove file from file array
    const updatedFiles = fileList.filter((_, i) => i !== index)
    setFileList(updatedFiles)
    
    // Notify parent component of the change
    if (onChange) {
      onChange(updatedFiles)
    }
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