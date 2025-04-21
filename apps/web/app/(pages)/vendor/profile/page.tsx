'use client';
import React, { useState } from "react";
import { useAuth } from "react-oidc-context";
import { useRouter } from "next/navigation";
import Header from "../../../_components/header";
import Footer from "../../../_components/footer";
import ProfilePhoto from "../../../_components/profilephoto";
import IconWithLabel from "../../../_components/iconwithlabel";
import { PencilLine, Star, BarChart2, Wallet } from "lucide-react";
import Button from "../../../_components/Button";


export default function ProfilePage() {
  const auth = useAuth();
  const router = useRouter();
  const username = "Coconut kitchen";
  const rating = 4.8;
  const bookings = 26;
  const revenue = 18200;

  const activityTiles = [
    { label: "Active", bg: "bg-[#4B4B4B]", text: "text-white", onClick: () => router.push("/vendor/activity/active") },
    { label: "Draft", bg: "bg-[#D9D9D9]", text: "text-white", onClick: () => router.push("/vendor/activity/draft")},
    { label: "Ended", bg: "bg-[#D9D9D9]", text: "text-white", onClick: () => router.push("/vendor/activity/ended") },
    {
      label: "+\nCreate \nNew Activity",
      bg: "bg-[#EB7926]", // orange-500
      text: "text-white",
      onClick: () => router.push("/vendor/activity/create")
    },
  ];

  const signOutRedirect = () => {
    const clientId = "45pi75s2fqmpp08p51pdupv5jc";
    const logoutUri = "http://localhost:3000/";
    const cognitoDomain = "https://ap-southeast-1kabcq3yw4.auth.ap-southeast-1.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  const handleSignOut = () => {
    auth.removeUser();
    signOutRedirect();
  } 

  return (
    <main className="font-poppins w-full flex flex-col justify-between gap-12 pb-12">
        <Header text="Profile" />
        <div className="flex flex-col gap-4 px-4">
    {/* Profile Header */}
    <div className="flex justify-between">
      <div className="flex gap-2">
        <ProfilePhoto size="sm" />
        <div className="flex flex-col justify-center gap-1">
          <div>
            {auth.user?.profile?.['cognito:username'] as string || username}
          </div>
          <div
            className="cursor-pointer"
            onClick={() => router.push("/vendor/profile/edit")}
          >
            <IconWithLabel
              icon={PencilLine}
              label="Edit profile"
              color="orange"
            />
          </div>
        </div>
      </div>
      <IconWithLabel
        icon={Star}
        label={rating.toString()}
        color="#F6BF27"
      />
    </div>

    {/* Stats Section */}
    <div className="flex justify-around w-full border border-orange-400 rounded-lg py-2 px-4">
      <div className="flex flex-col items-center text-center">
        <Star className="text-orange-500 w-5 h-5" />
        <span className="font-semibold text-sm">{rating}</span>
        <span className="text-xs">Avg. Rating</span>
      </div>
      <div className="flex flex-col items-center text-center">
        <BarChart2 className="text-orange-500 w-5 h-5" />
        <span className="font-semibold text-sm">{bookings}</span>
        <span className="text-xs">Bookings This Month</span>
      </div>
      <div className="flex flex-col items-center text-center">
        <Wallet className="text-orange-500 w-5 h-5" />
        <span className="font-semibold text-sm">{revenue.toLocaleString()}</span>
        <span className="text-xs">Revenue (Baht)</span>
      </div>
    </div>

    {/* Hosted Activities */}
    <div className="w-full mt-6">
      <h2 className="text-lg font-semibold mb-4">My Hosted Activities</h2>
      <div className="grid grid-cols-2 gap-4">
        {activityTiles.map((tile, index) => (
          <div
            key={index}
            className={`h-28 rounded-xl flex items-center justify-center text-center font-medium text-sm whitespace-pre-wrap ${tile.bg} ${tile.text}`}
            onClick={tile.onClick}
          >
            {tile.label}
          </div>
        ))}
      </div>
    </div>
  </div>
        <div
                className="flex justify-center"
            >
                <Button
                    label="Sign out"
                    variant="default"
                    onClick={handleSignOut}
                />
            </div>

            <Footer />
        </main>
    )
}