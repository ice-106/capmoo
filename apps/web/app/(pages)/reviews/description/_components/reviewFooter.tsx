import {
  ArrowUp,
  ArrowDown,
  MessageCircle,
  Share2,
  Pocket,
} from "lucide-react";

export interface ReviewFooterProps {
  onSave?: () => void;
  onUpvote?: () => void;
  onDownvote?: () => void;
  onComment?: () => void;
  onShare?: () => void;
}

const ReviewFooter: React.FC<ReviewFooterProps> = ({
  onSave,
  onUpvote,
  onDownvote,
  onComment,
  onShare,
}) => {
  return (
    <div className="fixed h-20 bottom-0 left-0 right-0 flex justify-center items-center bg-white border-t border-gray-200 z-10">
      <div className="w-[375px] flex justify-between items-center px-4">
        {/* Left side with save button */}
        <div>
          <button
            aria-label="Save"
            className="flex items-center justify-center"
            onClick={onSave}
          >
            <Pocket size={24} />
          </button>
        </div>

        {/* Right side with action buttons */}
        <div className="flex gap-x-8">
          <button
            aria-label="Upvote"
            className="flex items-center justify-center"
            onClick={onUpvote}
          >
            <ArrowUp size={24} />
          </button>
          <button
            aria-label="Downvote"
            className="flex items-center justify-center"
            onClick={onDownvote}
          >
            <ArrowDown size={24} />
          </button>
          <button
            aria-label="Comment"
            className="flex items-center justify-center"
            onClick={onComment}
          >
            <MessageCircle size={24} />
          </button>
          <button
            aria-label="Share"
            className="flex items-center justify-center"
            onClick={onShare}
          >
            <Share2 size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewFooter;
