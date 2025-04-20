"use client";

import { usePathname, useRouter } from 'next/navigation';
import { SearchFormValues } from '../../../_types/search';
import Header from "../../../_components/header";
import Carousel from "../../../_components/carousel";
import SearchBar from "../../../_components/searchbar";
import { CalendarDays, Home, UserRound } from 'lucide-react';

export default function Page() {
  const pathname = usePathname();
  const router = useRouter();

  const defaultImageUrl = "/images/default_profile.png";
  const imgArray = [
    { imgUrl: defaultImageUrl, text: "Image Card 1", onClickUrl: "/" },
    {
      imgUrl: defaultImageUrl,
      text: "Image Card 2 Long ass name kinda bad help me please there's an earthquake",
      onClickUrl: "/",
    },
    { imgUrl: defaultImageUrl, text: "Image Card 3", onClickUrl: "/" },
  ];

  // Function to convert form values to URL parameters
  const formValuesToUrlParams = (formValues: SearchFormValues) => {
    const params = new URLSearchParams();
    
    // Add search term if it exists
    if (formValues.searchTerm) params.append('q', formValues.searchTerm);
    
    return params.toString();
  };

  // Handler for search submission
  const handleSearch = (formValues?: SearchFormValues) => {
    if (formValues) {
      // Convert form values to URL parameters
      const urlParams = formValuesToUrlParams(formValues);

      if (!urlParams) {
        return;
      }
      
      // Log the URL that would be created
      console.log(`Would navigate to: /discover/search?${urlParams}`);
      
      router.push(`/discover/search?${urlParams}`);
    }
  };
  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <main className="font-poppins w-full">
      <Header text="My Activities" />
      <nav className="fixed h-28 bottom-0 left-0 right-0 flex justify-center items-start bg-white p-4 shadow-[0_-2px_8px_-2px_rgba(0,0,0,0.2)] z-10">
      <div className="flex justify-evenly w-[375px]">
        <div
          className={`p-2 rounded-md ${isActive("/vendor/activity") ? "text-pumpkin" : "text-darkgrey"}`}
          onClick={() => router.push("/vendor/schedule")}
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
      <div className="flex flex-col gap-y-8">
        <SearchBar
          placeholder="Search..."
          onSearch={handleSearch}
          enableDrawer={false}
        />
        <Carousel
          header="Active Activities"
          images={imgArray}
          exploreLink="/vendor/activity"
        />
        <Carousel
          header="Ended Activities"
          images={imgArray}
          exploreLink="/vendor/activity"
        />
        <Carousel
          header="Drafted Activities"
          images={imgArray}
          exploreLink="/vendor/activity"
        />
      </div>
    </main>
  );
}