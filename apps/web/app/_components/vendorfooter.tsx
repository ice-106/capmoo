'use client'
import React from "react";
import { usePathname, useRouter } from 'next/navigation';
import { CalendarDays, Home, UserRound } from 'lucide-react';

const VendorFooter = () => {
    const pathname = usePathname();
    const router = useRouter();
    const isActive = (path: string) => pathname.startsWith(path);

    return (
        <nav className="fixed h-28 bottom-0 left-0 right-0 flex justify-center items-start bg-white p-4 shadow-[0_-2px_8px_-2px_rgba(0,0,0,0.2)] z-10">
            <div className="flex justify-evenly w-[375px]">
                <div
                    className={`p-2 rounded-md ${isActive("/vendor/activity") ? "text-pumpkin" : "text-darkgrey"}`}
                    onClick={() => router.push("/vendor/activity")}
                >
                    <Home size={24} />
                </div>
                <div
                    className={`p-2 rounded-md ${isActive("/vendor/schedule") ? "text-pumpkin" : "text-darkgrey"}`}
                    onClick={() => router.push("/vendor/schedule")}
                >
                    <CalendarDays size={24} />
                </div>
                <div
                    className={`p-2 rounded-md ${isActive("/vendor/profile") ? "text-pumpkin" : "text-darkgrey"}`}
                    onClick={() => router.push("/vendor/profile")}
                >
                    <UserRound size={24} />
                </div>
            </div>
        </nav>
    );
};

export default VendorFooter;