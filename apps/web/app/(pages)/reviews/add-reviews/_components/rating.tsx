'use client'
import { useState } from 'react'
import { Star } from 'lucide-react'

const Rating: React.FC<{ rating: number; setRating: (r: number) => void }> = ({
  rating,
  setRating,
}) => {
  // Current rating
  const [hovered, setHovered] = useState<number | null>(null) // Hover state
  return (
    <div>
      <div className='mb-4 text-lg font-semibold'>Rating</div>
      <div className='mb-4 flex items-center justify-center space-x-4'>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className='cursor-pointer transition-all'
            size={36}
            fill={star <= (hovered ?? rating) ? 'orange' : 'none'}
            stroke={star <= (hovered ?? rating) ? 'orange' : 'lightgray'}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => setRating(star)}
          />
        ))}
      </div>
    </div>
  )
}

export default Rating
