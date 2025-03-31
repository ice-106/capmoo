'use client';

import { useState } from 'react';

interface ImageData {
  src: string;
}

interface GalleryProps {
  images: ImageData[];
}

export default function Gallery({ images }: GalleryProps) {
  const [slideIdx, setSlideIdx] = useState(0);
  const totalImages = images.length;

  // Limit the maximum number of images to 10
  const MAX_IMAGES = 10;
  const visibleImages = images.slice(0, Math.min(MAX_IMAGES, totalImages));

  // Next slide logic: Prevent sliding past the last image
  const nextSlide = () =>
    setSlideIdx((prev) => (prev < visibleImages.length - 1 ? prev + 1 : prev));

  // Previous slide logic: Prevent sliding past the first image
  const prevSlide = () =>
    setSlideIdx((prev) => (prev > 0 ? prev - 1 : prev));

  // Logic to show main dots and side dots depending on the number of images
  const getDots = () => {
    if (totalImages <= 3) {
      // Show dots for the exact number of images
      return visibleImages.map((_, i) => (
        <div
          key={i}
          onClick={() => setSlideIdx(i)}
          className={`cursor-pointer w-3 h-3 rounded-full transition-all duration-300 ${
            slideIdx === i ? 'bg-black' : 'bg-white opacity-60'
          }`}
        />
      ));
    } else {
      // Show 3 main center dots, and smaller side dots if there are more images
      const dots = [];
      // Left-side smaller dot
      if (slideIdx > 1) {
        dots.push(
          <div
            key="left-side"
            onClick={() => setSlideIdx(0)}
            className="cursor-pointer w-2 h-2 rounded-full bg-black opacity-40"
          />
        );
      }
      // Central dots (up to 3)
      for (let i = Math.max(0, slideIdx - 1); i < Math.min(slideIdx + 2, totalImages); i++) {
        dots.push(
          <div
            key={i}
            onClick={() => setSlideIdx(i)}
            className={`cursor-pointer w-3 h-3 rounded-full transition-all duration-300 ${
              slideIdx === i ? 'bg-black' : 'bg-white opacity-60'
            }`}
          />
        );
      }
      // Right-side smaller dot
      if (slideIdx < totalImages - 2) {
        dots.push(
          <div
            key="right-side"
            onClick={() => setSlideIdx(totalImages - 1)}
            className="cursor-pointer w-2 h-2 rounded-full bg-black opacity-40"
          />
        );
      }
      return dots;
    }
  };

  return (
    <div className="w-full max-w-xs mx-auto mt-10">
      {/* Image Section */}
      <div className="relative w-37 h-70 overflow-hidden rounded-xl">
        <img
          src={visibleImages[slideIdx].src}
          alt="carousel image"
          className="w-full h-full object-cover rounded-lg transition-transform duration-300 transform hover:scale-105"
        />

        {/* Navigation Arrows */}
        <div className="absolute inset-0 flex justify-between items-center px-4">
          <button
            onClick={prevSlide}
            className="bg-white text-gray-700 rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-gray-100"
          >
            ‹
          </button>
          <button
            onClick={nextSlide}
            className="bg-white text-gray-700 rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-gray-100"
          >
            ›
          </button>
        </div>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {getDots()}
        </div>
      </div>
    </div>
  );
}
