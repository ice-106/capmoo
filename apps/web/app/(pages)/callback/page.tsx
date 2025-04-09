"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from 'react-oidc-context';

export default function CallbackPage() {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!auth.isLoading && auth.isAuthenticated) {
      router.push('/');
    }
  }, [auth.isLoading, auth.isAuthenticated]);

  if (auth.isLoading) return <div>Completing sign-in...</div>;
  if (auth.error) return <div>Error: {auth.error.message}</div>;

  return <div>Redirecting...</div>;
}
