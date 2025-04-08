import React from "react";
import ImageCard from "./imagecard";
import { ImageItem } from "../_types/images";

interface MasonryProps {
  images: ImageItem[];
  aspectRatio?: "sm" | "md-1:1" | "md-4:5" | "md-3:4";

}

const Masonry: React.FC<MasonryProps> = ({
  images,
  aspectRatio = "md-4:5",
}) => {
  return (
    <section className="relative flex flex-col gap-y-3">
      <div className="grid w-full grid-cols-2 gap-4 place-items-center">
        {images.map((img, index) => (
          <ImageCard
            key={index}
            aspectRatio={aspectRatio}
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