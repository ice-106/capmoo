import React from "react";
import ImageCard from "./imagecard";

interface ImageItem {
  imgUrl: string;
  text: string;
  onClickUrl: string;
}

interface CarouselProps {
  header: string;
  images: ImageItem[];
  exploreLink?: string;
}

const Carousel: React.FC<CarouselProps> = ({
  header,
  images,
  exploreLink = "#",
}) => {
  return (
    <section className="relative flex flex-col gap-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{header}</h3>
        <a href={exploreLink} className="text-xs underline italic text-pumpkin">
          Explore all {">"}
        </a>
      </div>
      <div className="-mx-6 px-6 flex gap-x-4 overflow-x-scroll">
        {images.map((img, index) => (
          <ImageCard
            key={index}
            aspectRatio="sm"
            imageUrl={img.imgUrl}
            text={img.text}
            onClickUrl={img.onClickUrl}
          />
        ))}
      </div>
    </section>
  );
};

export default Carousel;
