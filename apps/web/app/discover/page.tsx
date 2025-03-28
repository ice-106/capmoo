"use client";

import Header from "../_components/header";
import Footer from "../_components/footer";
import ImageCard from "../_components/imagecard";

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
        <section className="relative flex flex-col gap-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Popular Activities</h3>
            <a href="#" className="text-xs underline italic text-pumpkin">
              Explore all {">"}
            </a>
          </div>
          {/* -mx-6 and px-6 is for horizontal scroll*/}
          <div className="-mx-6 px-6 flex gap-x-4 overflow-x-scroll">
            {imgArray.map((img, index) => {
              return (
                <ImageCard
                  key={index}
                  aspectRatio="sm"
                  imageUrl={img.imgUrl}
                  text={img.text}
                  onClickUrl={img.onClickUrl}
                />
              );
            })}
          </div>
        </section>
        <section className="relative flex flex-col gap-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Upcoming Activities</h3>
            <a href="#" className="text-xs underline italic text-pumpkin">
              Explore all {">"}
            </a>
          </div>
          <div className="-mx-6 px-6 flex gap-x-4 overflow-x-scroll">
            {imgArray.map((img, index) => {
              return (
                <ImageCard
                  key={index}
                  aspectRatio="sm"
                  imageUrl={img.imgUrl}
                  text={img.text}
                  onClickUrl={img.onClickUrl}
                />
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
