import React from 'react'
import ImageCard from './imagecard'
import { ImageItem } from '../_types/images'

interface CarouselProps {
  header: string
  images: ImageItem[]
  exploreLink?: string
}

const Carousel: React.FC<CarouselProps> = ({
  header,
  images,
  exploreLink = '#',
}) => {
  return (
    <section className='relative flex flex-col gap-y-3'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-semibold'>{header}</h3>
        <a href={exploreLink} className='text-pumpkin text-xs italic underline'>
          Explore all {'>'}
        </a>
      </div>
      <div className='-mx-6 flex gap-x-4 overflow-x-scroll px-6'>
        {images.map((img, index) => (
          <ImageCard
            key={index}
            aspectRatio='sm'
            imageUrl={img.imgUrl}
            text={img.text}
            onClickUrl={img.onClickUrl}
          />
        ))}
      </div>
    </section>
  )
}

export default Carousel
