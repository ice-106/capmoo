import NameTag from './nameTag';

interface TextBubbleProps {
  variant?: 'ai' | 'user';
  children: React.ReactNode;
  image?: string;
  showNameTag?: boolean;
}

const TextBubble = ({ 
  variant = 'user', 
  children, 
  image,
  showNameTag = true
}: TextBubbleProps) => {
  const baseClasses = 'rounded-lg p-3 text-sm break-words max-w-[85%]';
  const aiClasses = 'bg-orange text-white self-start';
  const userClasses = 'bg-white border border-darkgrey text-darkgrey self-end';

  return (
    <div className="flex flex-col w-full">
      {showNameTag && (
        <NameTag variant={variant} image={image} />
      )}
      <div
        className={`${
          variant === 'ai' ? aiClasses : userClasses
        } ${baseClasses}`}
      >
        {children}
      </div>
    </div>
  );
} 

export default TextBubble;