"use client";

import Header from "../_components/header";
import Footer from "../_components/footer";
import Carousel from "../_components/carousel";

export default function Page() {
  // Example image array usage
  // Replace with actual image URLs and corresponding text and URLs
  const imgArray = [
    { imgUrl: "", text: "Image Card 1", onClickUrl: "/" },
    {
      imgUrl: "",
      text: "Image Card 2 Long ass name kinda bad help me please there's an earthquake",
      onClickUrl: "/",
    },
    { imgUrl: "", text: "Image Card 3", onClickUrl: "/" },
  ];

  return (
    <main className="font-poppins w-full">
      <Header text="Discover" />
      <Footer />
      <div className="flex flex-col gap-y-8">
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
