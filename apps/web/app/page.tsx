"use client";

import React, { useEffect } from "react";
import { useAuth } from 'react-oidc-context';
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Page() {
  const auth = useAuth();
  const router = useRouter();

  const signOutRedirect = () => {
    const clientId = "45pi75s2fqmpp08p51pdupv5jc";
    const logoutUri = "http://localhost:3000/";
    const cognitoDomain = "https://ap-southeast-1kabcq3yw4.auth.ap-southeast-1.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  useEffect(() => {
    // Only redirect if the user is authenticated
    if (auth.isAuthenticated) {
      router.push("/discover");
    }
  }, [auth.isAuthenticated, router]);

  return (
    <main className="font-poppins w-full relative pt-[240px]">
      {/* Background circle and Logo */}
      <div
        className={`absolute top-[-512px] left-[50%] -translate-x-1/2 flex justify-center items-end h-[720px] w-[720px] pb-16 rounded-full bg-pumpkin-lemon`}
      >
        <Image
          src="/images/Logo.png"
          alt="Capmoo"
          width={144}
          height={144}
          className="w-[144px] h-auto"
        />
      </div>

      <div
        className="flex flex-col gap-12"
      >
        {/* Title */}
        <div
          className="flex flex-col items-center gap-4 w-full"
        >
          <h1
            className="text-5xl text-black"
          >
            Capmoo
          </h1>
          <span
            className="font-semibold text-xs"
          >Get started, enhance your travel</span>
        </div>

        {/* Buttons */}
        <div
          className="flex flex-col items-center gap-2 w-full"
        >
          {auth.isLoading ? (
            <div>
              Loading...
            </div>
          ) : (
            <>
              <button onClick={() => auth.signinRedirect()}>Login</button>
              <button onClick={() => signOutRedirect()}>Sign out</button>
            </>

          )}

          {auth.error && (
            <div className="text-red text-md">
              {(auth.error as Error).message}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
