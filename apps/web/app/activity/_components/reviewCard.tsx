import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface ReviewCardProps {
  profileImgUrl: string;
  userName: string;
  reviewText: string;
  reviewUrl: string;
}

const ReviewCard = ({profileImgUrl, userName, reviewText, reviewUrl}: ReviewCardProps) => {
  const router = useRouter();

  const handleReviewClick = () => {
    console.log("Review clicked");
    router.push(`/reviews/${reviewUrl}`);
  }
  return (
    <div 
      className="w-full p-2 border border-lightgrey rounded-lg gap-y-4 cursor-pointer"
      onClick={handleReviewClick}
      >
      <span className="flex gap-x-4 items-center text-xs font-semibold mb-1">
        <Image
        src={profileImgUrl}
        alt="Profile Image"
        width={24}
        height={24}
        className="rounded-full" />
        {userName}
      </span>
      <p className="line-clamp-2 overflow-hidden text-ellipsis">
        {reviewText}
      </p>
    </div>
  )
}

export default ReviewCard