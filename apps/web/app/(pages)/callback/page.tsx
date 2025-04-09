"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from 'react-oidc-context';

export default function CallbackPage() {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!auth.isLoading && auth.isAuthenticated) {
      router.push('/');
    }
  }, [auth.isLoading, auth.isAuthenticated, router]);

  const renderLoader = () => (
    <div className="flex w-full h-full justify-center items-center">
      <div className="w-[180px] h-[180px] rounded-2xl bg-pumpkin-lemon p-6">
        <Image
          src="/images/Logo.png"
          width={144}
          height={144}
          alt="Capmoo"
          className="w-full h-full"
        />
      </div>
    </div>
  );

  if (auth.error) return <div>Error: {auth.error.message}</div>;
  else return renderLoader();
}