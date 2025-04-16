"use client"
import { useState } from 'react';
import { Star } from 'lucide-react';
import TextBox from './textbox';

const Rating: React.FC<{ rating: number; setRating: (r: number) => void }> = ({ rating, setRating }) => {         // Current rating
  const [hovered, setHovered] = useState<number | null>(null); // Hover state
  const [comment, setComment] = useState("");
  return (
    <div>
    <div className="text-lg font-semibold mb-4">Rating</div>
    <div className="flex space-x-4 justify-center items-center mb-4">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className='cursor-pointer transition-all'
          size = {36}
          fill = {star <= (hovered ?? rating) ? 'orange' : 'none'}
          stroke = {star <= (hovered ?? rating) ? 'orange' : 'lightgray'}
          onMouseEnter = {() => setHovered(star)}
          onMouseLeave = {() => setHovered(null)}
          onClick={() => setRating(star)}
        />
      ))}
    </div>
    <TextBox value={comment} placeholder={'Add your comment...'} onChange={setComment} />
    </div>
  );
};

export default Rating;