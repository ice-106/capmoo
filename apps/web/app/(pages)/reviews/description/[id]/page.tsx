"use client";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import BackButton from "../../../../_components/BackButton";
import Gallery from "../../../../_components/galleryrect";
import Tag from "../_components/tag";
import ReviewFooter from "../_components/reviewFooter";
import { Star } from "lucide-react";
import Image from "next/image";

export default function ReviewDescriptionPage() {
  const params = useParams();
  const reviewId = params.id as string;

  // mock data
  const userProfileUrl = "/images/default_profile.png";
  const defaultImageUrl = [
    { src: "/images/default_profile.png" },
    { src: "/images/default_profile.png" },
  ];

  const mockReviews = [
    {
      id: "1",
      author: "User 1",
      activity: "Activity 1",
      location: "Location 1",
      price: "200 THB",
      rating: 3.5,
      comment:
        "Tung tung tung tung tunh sahur Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque non.",
      images: defaultImageUrl,
    },
    {
      id: "2",
      author: "User 2",
      activity: "Activity 2",
      location: "Location 2",
      price: "300 THB",
      rating: 1.2,
      comment:
        "Brombodido Croccodido blah blah blah blah blah blah blah blah blah blah",
      images: defaultImageUrl,
    },
    {
      id: "3",
      author: "User 3",
      activity: "Capmoo Adventure",
      location: "Location 3",
      price: "400 THB",
      rating: 4.5,
      comment:
        "Talalero Tralala Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque non.",
      images: defaultImageUrl,
    },
  ];

  const getMockReviewData = (id: string) => {
    // find the review match with the ID
    const review = mockReviews.find((review) => review.id === id);
    return review || null;
  };

  // state for review data
  const [review, setReview] = useState(getMockReviewData(reviewId));

  // Event handlers for the footer
  const handleSave = () => {
    console.log("Save clicked");
  };

  const handleUpvote = () => {
    console.log("Upvote clicked");
  };

  const handleDownvote = () => {
    console.log("Downvote clicked");
  };

  const handleComment = () => {
    console.log("Comment clicked");
  };

  const handleShare = () => {
    console.log("Share clicked");
  };

  // provide feedback if the review is not found
  if (!review) {
    return (
      <main className="font-poppins w-full h-screen flex flex-col items-center justify-center">
        {/* transparent header  with back button*/}
        <div className="fixed flex w-full h-24 top-0 left-0 right-0 justify-center items-end p-4">
          <div className="w-[375px] flex items-center justify-between px-4">
            <BackButton />
          </div>
        </div>
        <p className="text-xl text-gray">Review not found</p>
      </main>
    );
  }
  return (
    <main className="font-poppins w-full h-screen flex flex-col items-center">
      {/* Fixed header - always visible */}
      <div className="fixed flex w-full h-24 top-0 left-0 right-0 justify-center items-end p-4 bg-white z-50">
        <div className="w-[375px] flex items-center justify-between px-4">
          <BackButton />
        </div>
      </div>

      {/* Gallery with button */}
      <div className="w-full max-w-[375px] pb-20">
        <div className="w-full mb-1">
          <Gallery images={review.images} />
        </div>
        {/* Content container */}
        <div className="flex flex-col gap-y-3 mt-4">
          <div className="flex item-center">
            <div className="flex items-center gap-x-2 flex-1">
              <Image
                src={userProfileUrl}
                alt="Profile Image"
                width={24}
                height={24}
                className="rounded-full"
              />

              <div className="text-md font-semibold">{review.author}</div>
            </div>
            <span className="flex gap-x-3">
              <Star className="text-lemon w-6 h-6" />
              {review.rating}
            </span>
          </div>
          <h3>{review.activity}</h3>
          <div className="flex gap-x-3">
            <Tag>Locaion: {review.location}</Tag>
            <Tag>Price: {review.price}</Tag>
          </div>
          <div className="text-md border border-lightgrey rounded-lg px-2 py-2">
            {review.comment}
          </div>
        </div>
      </div>
      {/* Footer section */}
      <ReviewFooter
        onSave={handleSave}
        onUpvote={handleUpvote}
        onDownvote={handleDownvote}
        onComment={handleComment}
        onShare={handleShare}
      />
    </main>
  );
}
