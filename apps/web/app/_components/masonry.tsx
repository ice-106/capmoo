import React from "react";
import ImageCard from "./imagecard";
import { ImageItem } from "../_types/images";

interface MasonryProps {
  images: ImageItem[];
}

const Masonry: React.FC<MasonryProps> = ({
  images,
}) => {
  return (
    <section className="relative flex flex-col gap-y-3">
      <div className="grid w-full grid-cols-2 gap-4">
        {images.map((img, index) => (
          <ImageCard
            key={index}
            aspectRatio="md-4:5"
            imageUrl={img.imgUrl}
            text={img.text}
            onClickUrl={img.onClickUrl}
          />
        ))}
      </div>
    </section>
  );
};

export default Masonry;