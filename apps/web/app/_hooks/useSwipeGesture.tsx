import { useState, useRef } from 'react';

interface UseSwipeGestureProps {
  edgeThreshold?: number;     // How close to the edge to start swipe (in px)
  swipeThreshold?: number;    // How far to swipe to trigger action (in px)
  direction?: 'right' | 'left' | 'both';  // Direction of swipe to detect
  onSwipeComplete?: () => void; // Action to perform when swipe threshold is met
}

interface SwipeHandlers {
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
  style: {
    transform: string;
    transition: string;
  };
}

export function useSwipeGesture({
  edgeThreshold = 30,
  swipeThreshold = 100,
  direction = 'right',
  onSwipeComplete
}: UseSwipeGestureProps = {}): [number, SwipeHandlers] {
  const [translateX, setTranslateX] = useState(0);
  const startXRef = useRef(0);
  const isDraggingRef = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      startXRef.current = e.touches[0].clientX;
      
      // Only enable swiping if started near the edge
      if (direction === 'right' && e.touches[0].clientX < edgeThreshold) {
        isDraggingRef.current = true;
      } else if (direction === 'left' && e.touches[0].clientX > window.innerWidth - edgeThreshold) {
        isDraggingRef.current = true;
      } else if (direction === 'both') {
        isDraggingRef.current = true;
      }
    }
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    
    if (e.touches[0]) {
      const currentX = e.touches[0].clientX;
      const diff = currentX - startXRef.current;

      // Filter by direction
      if (direction === 'right' && diff > 0) {
        setTranslateX(diff);
      } else if (direction === 'left' && diff < 0) {
        setTranslateX(diff);
      } else if (direction === 'both') {
        setTranslateX(diff);
      }
    }
  };
  
  const handleTouchEnd = () => {
    if (!isDraggingRef.current) return;
    
    isDraggingRef.current = false;
    
    // Check if swiped far enough to trigger action
    if (direction === 'right' && translateX > swipeThreshold) {
      onSwipeComplete?.();
    } else if (direction === 'left' && translateX < -swipeThreshold) {
      onSwipeComplete?.();
    } else if (direction === 'both' && Math.abs(translateX) > swipeThreshold) {
      onSwipeComplete?.();
    } else {
      // Reset position with animation
      setTranslateX(0);
    }
  };

  return [
    translateX,
    {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      style: {
        transform: `translateX(${translateX}px)`,
        transition: isDraggingRef.current ? 'none' : 'transform 0.3s ease-out'
      }
    }
  ];
}