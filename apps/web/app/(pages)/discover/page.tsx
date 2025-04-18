"use client";

import { useRouter } from 'next/navigation';
import { SearchFormValues } from '../../_types/search';
import Header from "../../_components/header";
import Footer from "../../_components/footer";
import Carousel from "../../_components/carousel";
import SearchBar from "../../_components/searchbar";

export default function Page() {
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
    
    // Add location if selected
    if ((formValues.location ?? []).length > 0) {
      (formValues.location ?? []).forEach((loc: string) => {
        params.append('location', loc);
      });
    }
    
    // Add price range if provided
    if (formValues.minPrice) params.append('minPrice', formValues.minPrice);
    if (formValues.maxPrice) params.append('maxPrice', formValues.maxPrice);
    
    // Add categories if selected
    if ((formValues.categories ?? []).length > 0) {
      (formValues.categories ?? []).forEach((cat: string) => {
        params.append('category', cat);
      });
    }
    
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
      <Header text="Discover" />
      <Footer />
      <div className="flex flex-col gap-y-8">
        <SearchBar
          placeholder="Search..."
          onSearch={handleSearch}
          enableDrawer
        />
        <Carousel
          header="Popular Activities"
          images={imgArray}
          exploreLink="/discover"
        />
        <Carousel
          header="Upcoming Activities"
          images={imgArray}
          exploreLink="/discover"
        />
      </div>
    </main>
  );
}