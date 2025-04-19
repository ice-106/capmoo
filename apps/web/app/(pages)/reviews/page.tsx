"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import SearchBar from "../../_components/searchbar";
import HeaderwithIcon from "../../_components/headerwithIcon";
import Footer from "../../_components/footer";
import { CirclePlus } from "lucide-react";
import Masonry from "../../_components/masonry";

export default function ReviewPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // mock data
  const defaultImageUrl = "/images/default_profile.png";
  const reviewItems = [
    {
      id: "1",
      imgUrl: defaultImageUrl,
      text: "Review Card 1",
      onClickUrl: "/reviews/description/1",
    },
    {
      id: "2",
      imgUrl: defaultImageUrl,
      text: "Review Card 2 pingu pinga kwack kwack",
      onClickUrl: "/reviews/description/2",
    },
    {
      id: "3",
      imgUrl: defaultImageUrl,
      text: "Review Card 3",
      onClickUrl: "/reviews/description/3",
    },
    {
      id: "4",
      imgUrl: defaultImageUrl,
      text: "Review Card 4 bing bing bing",
      onClickUrl: "/reviews/description/4",
    },
    {
      id: "5",
      imgUrl: defaultImageUrl,
      text: "Review Card 5 ba ba ba ba na na na",
      onClickUrl: "/reviews/description/5",
    },
    {
      id: "6",
      imgUrl: defaultImageUrl,
      text: "Review Card 6",
      onClickUrl: "/reviews/description/6",
    },
    {
      id: "7",
      imgUrl: defaultImageUrl,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque non.",
      onClickUrl: "/reviews/description/7",
    },
    {
      id: "8",
      imgUrl: defaultImageUrl,
      text: "Review Card 8",
      onClickUrl: "/reviews/description/8",
    },
  ];

  // filter reviews based on search query
  const filteredReviews = searchQuery
    ? reviewItems.filter((item) =>
        item.text.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : reviewItems;

  return (
    <main className="font-poppins w-full">
      <HeaderwithIcon
        text="Reviews"
        rightIcon={
          <div onClick={() => router.push("/reviews/add-reviews")}>
            <CirclePlus size={24} color="white" />
          </div>
        }
      />
      <div className="flex justify-center items-center pt-4 px-4">
        <SearchBar
          placeholder="Search reviews..."
          value={searchQuery}
          onChange={(value: string) => setSearchQuery(value)}
          onSearch={() =>
            console.log("Search triggered with query:", searchQuery)
          }
          width="100%"
          enableDrawer={false}
        />
      </div>

      <div className="mt-4 px-4">
        {/* show search results */}
        {searchQuery && (
          <div className="flex items-center justify-between">
            <p>Search results for : &quot;{searchQuery}&quot;</p>
            <button
              className="italic text-xs text-orange underline"
              onClick={() => setSearchQuery("")}
            >
              Clear
            </button>
          </div>
        )}

        {/* Masonry layout for reviews */}
        {filteredReviews.length > 0 ? (
          <div className="mt-4">
            <Masonry images={filteredReviews} />
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-grey">No reviews found</h3>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
