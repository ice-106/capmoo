import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ImageCardProps {
  aspectRatio: "sm" | "md-1:1" | "md-4:5" | "md-3:4";
  imageUrl: string; // URL of the image
  text: string;
  onClickUrl?: string; // URL to navigate to on click
}

const aspectRatioClasses: Record<
  "sm" | "md-1:1" | "md-4:5" | "md-3:4",
  string
> = {
  sm: "w-32 h-40",
  "md-1:1": "w-40 h-40",
  "md-4:5": "w-40 h-48",
  "md-3:4": "w-40 h-52",
};

const ImageCard: React.FC<ImageCardProps> = ({
  aspectRatio,
  imageUrl,
  text,
  onClickUrl,
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (onClickUrl) {
      router.push(onClickUrl); // Navigate to the specified URL
    }
  };

  return (
    <div className="cursor-pointer gap-y-2" onClick={handleClick}>
      <div
        className={`relative flex-shrink-0 overflow-hidden rounded-lg bg-lightgrey ${aspectRatioClasses[aspectRatio]}`}
      >
        <Image
          src={imageUrl}
          alt="Image Card"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div>
        <p className="flex-shrink-0 w-full text-caption leading-tight line-clamp-2 text-ellipsis">
          {text}
        </p>
      </div>
    </div>
  );
};

export default ImageCard;
