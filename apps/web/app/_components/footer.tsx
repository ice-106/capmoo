"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  CalendarDays,
  Bot,
  MessageSquareText,
  UserRound,
} from "lucide-react";

const Footer = () => {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <nav className="fixed h-28 bottom-0 left-0 right-0 flex justify-center items-start bg-white p-4 shadow-lg shadow-darkgrey/50 z-10">
      <div className="flex space-x-7">
        <div
          className={`p-2 rounded-md ${isActive("/discover") ? "text-pumpkin" : "text-darkgrey"}`}
          onClick={() => router.push("/discover")}
        >
          <Home size={24} />
        </div>
        <div
          className={`p-2 rounded-md ${isActive("/schedule") ? "text-pumpkin" : "text-darkgrey"}`}
          onClick={() => router.push("/schedule")}
        >
          <CalendarDays size={24} />
        </div>
        <div
          className={`p-2 rounded-md ${isActive("/chat") ? "text-pumpkin" : "text-darkgrey"}`}
          onClick={() => router.push("/chat")}
        >
          <Bot size={24} />
        </div>
        <div
          className={`p-2 rounded-md ${isActive("/reviews") ? "text-pumpkin" : "text-darkgrey"}`}
          onClick={() => router.push("/reviews")}
        >
          <MessageSquareText size={24} />
        </div>
        <div
          className={`p-2 rounded-md ${isActive("/profile") ? "text-pumpkin" : "text-darkgrey"}`}
          onClick={() => router.push("/profile")}
        >
          <UserRound size={24} />
        </div>
      </div>
    </nav>
  );
};

export default Footer;
