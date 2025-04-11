import Image from 'next/image';
import { useRouter } from 'next/navigation';
import TextBtn from '../../_components/textBtn';

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
      <span className="flex justify-between items-center font-semibold mb-1">
        <div className="flex gap-x-4 items-center">
          <Image
          src={profileImgUrl}
          alt="Profile Image"
          width={24}
          height={24}
          className="rounded-full" />
          {userName}
        </div>
        <TextBtn text="Read" onClick={handleReviewClick} />
      </span>
      <p className="line-clamp-2 overflow-hidden text-ellipsis">
        {reviewText}
      </p>
    </div>
  )
}

export default ReviewCard