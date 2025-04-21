"use client";

import { useRouter } from 'next/navigation';
import { SearchFormValues } from '../../../_types/search';
import Header from "../../../_components/header";
import Carousel from "../../../_components/carousel";
import SearchBar from "../../../_components/searchbar";
import VendorFooter from '../../../_components/vendorfooter';

export default function Page() {
  const router = useRouter();

  const defaultImageUrl = "/images/default_profile.png";
  const imgArrayActive = [
    { imgUrl: defaultImageUrl, text: "Image Card 1", onClickUrl: "/vendor/active/1" },
    {
      imgUrl: defaultImageUrl,
      text: "Image Card 2 Long ass name kinda bad help me please there's an earthquake",
      onClickUrl: "/vendor/active/2",
    },
    { imgUrl: defaultImageUrl, text: "Image Card 3", onClickUrl: "/vendor/active/3" },
  ];

  const imgArrayEnded = [
    { imgUrl: defaultImageUrl, text: "Image Card 1", onClickUrl: "/vendor/ended/1" },
    {
      imgUrl: defaultImageUrl,
      text: "Image Card 2 Long ass name kinda bad help me please there's an earthquake",
      onClickUrl: "/vendor/ended/2",
    },
    { imgUrl: defaultImageUrl, text: "Image Card 3", onClickUrl: "/vendor/ended/3" },
  ];

  const imgArrayDraft = [
    { imgUrl: defaultImageUrl, text: "Image Card 1", onClickUrl: "/vendor/draft/1" },
    {
      imgUrl: defaultImageUrl,
      text: "Image Card 2 Long ass name kinda bad help me please there's an earthquake",
      onClickUrl: "/vendor/draft/2",
    },
    { imgUrl: defaultImageUrl, text: "Image Card 3", onClickUrl: "/vendor/draft/3" },
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

  return (
    <main className="font-poppins w-full">
      <Header text="My Activities" />
      <VendorFooter />
      <div className="flex flex-col gap-y-8">
        <SearchBar
          placeholder="Search..."
          onSearch={handleSearch}
          enableDrawer={false}
        />
        <Carousel
          header="Active Activities"
          images={imgArrayActive}
          exploreLink="/vendor/activity"
        />
        <Carousel
          header="Ended Activities"
          images={imgArrayEnded}
          exploreLink="/vendor/activity"
        />
        <Carousel
          header="Drafted Activities"
          images={imgArrayDraft}
          exploreLink="/vendor/activity"
        />
      </div>
    </main>
  );
}