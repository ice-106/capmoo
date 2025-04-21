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
  const reviewItems = [
    {
      id: "1",
      imgUrl: "/images/activity/user/activity_1.jpg",
      text: "The Sahur at Wat Phra Kaew 🛕✨",
      onClickUrl: "/reviews/description/1",
    },
    {
      id: "6",
      imgUrl: "/images/activity/user/activity_2.jpg",
      text: "Siam amazing kod zing kod zaddd 🗣🗣🔊🔊‼",
      onClickUrl: "/reviews/description/2",
    },
    {
      id: "3",
      imgUrl: "/images/activity/user/activity_6.jpg",
      text: "Sahur pa tour Sea Life Bangkok 🐟🦈🌊",
      onClickUrl: "/reviews/description/6",
    },
    {
      id: "4",
      imgUrl: "/images/activity/user/activity_3.jpg",
      text: "Safari world - POV - HumKungLnw 😎",
      onClickUrl: "/reviews/description/3",
    },
    {
      id: "5",
      imgUrl: "/images/activity/user/activity_4.jpg",
      text: "Birthday at Dream world ✨ !!!",
      onClickUrl: "/reviews/description/4",
    },
    {
      id: "6",
      imgUrl: "/images/activity/user/activity_5.jpg",
      text: "One day trip Bang Krachao cycling 🚴‍♀️",
      onClickUrl: "/reviews/description/5",
    },
    {
      id: "7",
      imgUrl: "/images/activity/user/activity_6.jpg",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque non.",
      onClickUrl: "/reviews/description/6",
    },
    {
      id: "8",
      imgUrl: "/images/activity/user/activity_1.jpg",
      text: "Review Card 8",
      onClickUrl: "/reviews/description/1",
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
