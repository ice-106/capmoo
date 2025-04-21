"use client";

import React, { useEffect } from "react";
import { useAuth } from 'react-oidc-context';
import Image from "next/image";
import { useRouter } from "next/navigation";
import FooterTemplate from "./_components/footerTemplate";

export default function Page() {
  const auth = useAuth();
  const router = useRouter();

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
            // Replace with Button component later
            <button
              className="bg-orange rounded-lg text-white px-4 py-2 w-[200px] text-lg font-semibold"
              onClick={() => auth.signinRedirect()}>
              Get started
            </button>
          )}

          {auth.error && (
            <div className="text-red text-md">
              {(auth.error as Error).message}
            </div>
          )}
        </div>
        <FooterTemplate>
          <div
            className="flex justify-center"
          >
            <a 
              href="/vendor/auth"
              className="underline text-grey"
            >
              vendor portal
            </a>
          </div>
        </FooterTemplate>
      </div>
    </main>
  );
}