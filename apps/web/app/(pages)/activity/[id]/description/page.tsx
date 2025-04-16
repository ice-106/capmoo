"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import NameSection from '../../_components/nameSection';
import ReviewCard from '../../_components/reviewCard';
import TextBtn from '../../../../_components/textBtn';
import FooterTemplate from '../../../../_components/footerTemplate';
import Button from '../../../../_components/Button';


export default function Page() {
  const router = useRouter();
  const params = useParams();
  const activityId = params.id as string;
  
  // We could use this state for real API data
  // const [activityData, setActivityData] = useState(null);
  
  // Log the ID from the route
  useEffect(() => {
    console.log("Activity ID from route:", activityId);
    
    // In a real scenario, we would fetch data based on the ID
    // fetchActivityData(activityId).then(data => setActivityData(data));
    // For now, we'll continue using mock data
  }, [activityId]);

  const handleBooking = () => {
    console.log("Book clicked");
    router.push(`/activity/${activityId}/booking`);
  }

  // Use the route ID in the mock data
  const mockData = {
    id: activityId,
    images: [
      { src: "/images/default_profile.png" },
      { src: "/images/default_profile.png" },
      { src: "/images/default_profile.png" },
    ],
    rating: 4.5,
    name: "Capmoo Adventure",
    date: "March 15, 2025",
    location: "Chulalongkorn University",
    price: "200 THB/person",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. \
    Cras ligula augue, rutrum eu nunc vel, aliquam sodales nulla. Suspendisse in mauris ut lorem maximus gravida vel eu ex.\
    Proin pulvinar arcu pharetra dui mollis, eget hendrerit ligula iaculis. Ut ut lectus vulputate odio bibendum fringilla dapibus ut arcu. \
    Vivamus porta ex at congue hendrerit. Donec tellus est, pellentesque a dolor vitae, aliquam gravida lacus. Curabitur sapien ligula,\
    imperdiet id nisl non, dignissim dictum justo. Aliquam mattis consectetur magna consectetur varius. Class aptent taciti sociosqu ad\
    litora torquent per conubia nostra, per inceptos himenaeos. Morbi non commodo metus, vel sodales enim. Suspendisse at ultricies purus."
  }

  const mockReviewData = [
    {
      profileImgUrl: "/images/default_profile.png",
      userName: "TungDudeCarryThailand",
      reviewText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ligula augue, rutrum eu nunc vel, aliquam sodales nulla.",
      reviewUrl: "1"
    },
    {
      profileImgUrl: "/images/default_profile.png",
      userName: "KikiLittleWitch",
      reviewText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ligula augue, rutrum eu nunc vel, aliquam sodales nulla.",
      reviewUrl: "2"
    },
    {
      profileImgUrl: "/images/default_profile.png",
      userName: "MildWannaGoToSleep",
      reviewText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ligula augue, rutrum eu nunc vel, aliquam sodales nulla.",
      reviewUrl: "3"
    }
  ]

  return (
    <main className="font-poppins w-full">
      <NameSection 
        images={mockData.images}
        rating={mockData.rating}
        name={mockData.name}
        date={mockData.date}
        location={mockData.location}
        price={mockData.price} 
      />
      <div className="w-full flex flex-col gap-y-8 mb-8">
        <section className="w-full p-2 border border-lightgrey rounded-lg">
          <b>Description</b> <br/>
          {mockData.description}
        </section>
        <section className="w-full flex flex-col gap-y-2">
          <span className="w-full flex justify-between">
            <h3>Read Reviews</h3>
            <TextBtn text="Read all reviews" onClick={() => router.push(`/reviews?q=${mockData.name}`)} />
          </span>
          {mockReviewData.map((review, index) => (
            <ReviewCard key={index} 
              profileImgUrl={review.profileImgUrl}
              userName={review.userName}
              reviewText={review.reviewText}
              reviewUrl={review.reviewUrl}
            />
          ))}
        </section>
        <span className="text-xs text-lightgrey text-center">That&apos;s all for now {':)'}</span>
      </div>
      <FooterTemplate>
        <div className="flex gap-x-4">
          <Button
            label="Save to Schedule"
            variant="default"  
            rounded="lg"      
            onClick={() => console.log("Save to Schedule clicked")}
            />
            <Button
            label="Book Now"
            variant="orange"    
            rounded="lg"    
            onClick={handleBooking}
            />
        </div>
      </FooterTemplate>
    </main>
  );
}