import Image from 'next/image';
import { useAuth } from 'react-oidc-context';

interface nameTagProps {
  variant?: 'ai' | 'user';
  image?: string;
}

const NameTag = ({ variant = 'user', image }: nameTagProps) => {
  const auth = useAuth();
  
  const username = variant === 'user' 
    && (auth.user?.profile?.['cognito:username'] as string || 'anonymous user');
  
  const imageSrc = variant === 'ai' 
    ? '/images/Logo.png' 
    : (image || '/images/default_profile.png');
  
  return (
    <div className="flex w-full items-center py-2 justify-between">
      {variant === 'ai' ? (
        <div className="flex items-center">
          <div className="bg-orange rounded-full p-0.5">
            <Image 
              src={imageSrc}
              alt="Capmoo AI"
              width={20}
              height={20}
              className="rounded-full"
            />
          </div>
          <span className="ml-2">Capmoo</span>
        </div>
      ) : (
        <div></div>
      )}
      
      {variant === 'user' && (
        <div className="flex items-center">
          <span className="mr-2">{username}</span>
          <Image 
            src={imageSrc}
            alt={`${username}'s profile`}
            width={24}
            height={24}
            className="rounded-full"
          />
        </div>
      )}
    </div>
  );
};

export default NameTag;