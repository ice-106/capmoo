import "./globals.css";
import type { Metadata } from "next";
import {
  Poppins,
  IBM_Plex_Sans_Thai,
  IBM_Plex_Sans_Thai_Looped,
} from "next/font/google";
import ClientWrapper from "./client-wrapper";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

const ibmPlexSansThai = IBM_Plex_Sans_Thai({
  subsets: ["latin", "thai"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans-thai",
});

const ibmPlexSansThaiLooped = IBM_Plex_Sans_Thai_Looped({
  subsets: ["latin", "thai"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans-thai-looped",
});

export const metadata: Metadata = {
  title: "Create Turborepo",
  description: "Generated by create turbo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${ibmPlexSansThai.variable} ${ibmPlexSansThaiLooped.variable}
      bg-gray-100 flex justify-center`}
      >
        {/* Recolor to white when finish dev*/}
        <div className="flex w-[375px] h-screen bg-white px-6 pt-[7.5rem] pb-28 justify-start items-start overflow-y-auto overflow-x-hidden">
          <ClientWrapper>{children}</ClientWrapper>
        </div>
      </body>
    </html>
  );
}
