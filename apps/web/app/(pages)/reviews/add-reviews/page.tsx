"use client";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import BackButton from '../../../_components/BackButton';
import PreviousActivitySelector from "./_component/previousactivity";
import Rating from "./_component/rating";
import ImageUploader from "./_component/imageupload";
import FooterTemplate from "../../../_components/footerTemplate";
import Button from "../../../_components/Button";

export default function Page() {
  const router = useRouter();

  // Previous Activity Search Drawer
  const [selectedActivity, setSelectedActivity] = useState<string[]>([]);
  // Modify dropdown to select only one activity
  const handleSelectActivity = (selectedActivity: string[]) => {
    if (selectedActivity.length > 0 && selectedActivity[selectedActivity.length - 1]) {
      setSelectedActivity([selectedActivity[selectedActivity.length - 1] as string]);
    } else {
      setSelectedActivity([]);
    }
  };
  // TODO : Fetch actual data from database
  type Activity = {
    id: number;
    images: { src: string }[];
    name: string;
    date: string;
    location: string;
    price: string;
    description: string;
  }; 

  const dataDummy: Activity[] = [
    {
      id: 1,
      images: [{ src: "/images/default_profile.png" }, { src: "/images/default_profile.png" }, { src: "/images/default_profile.png" }],
      name: "Intania Expo 111",
      date: "March 28, 2025 - March 30, 2025",
      location: "Faculty of Engineering Chulalongkorn University",
      price: "200 THB/person",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
    },
    {
      id: 2,
      images: [{ src: "/images/default_profile.png" }, { src: "/images/default_profile.png" }, { src: "/images/default_profile.png" }],
      name: "ISE Open House 2025",
      date: "Nov 2, 2024",
      location: "Faculty of Engineering Chulalongkorn University",
      price: "200 THB/person",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
    }
  ];

  // TODO: Extract Data from JSON
  const optionsDummy = dataDummy.map((activity) => activity.name);
  const selectedInfo = dataDummy.find((a) => a.name === selectedActivity[0]);
  const activityDate = selectedInfo?.date ?? "-";
  const activityLocation = selectedInfo?.location ?? "-";


  const [rating, setRating] = useState(0);
  const isFormValid = (selectedActivity.length > 0 && rating > 0)
  const handlePost = () => {
    console.log("Keeping activity selections:", selectedActivity[selectedActivity.length-1], rating);
    router.push('/reviews');
  }

  return (
    <main className="font-poppins w-full">
      <div className="fixed flex w-full h-24 top-0 left-0 right-0 justify-center items-end p-4 bg-white z-10">
      <div className="w-[375px] flex items-center justify-between px-4">
        <BackButton/>
      </div>
    </div>
      <FooterTemplate>
        <Button label="Post" variant="orange" onClick={handlePost} disabled={!isFormValid} />
      </FooterTemplate>
      <div className="flex flex-col gap-y-8">
        <ImageUploader />
        <div className="text-lg font-semibold">Activity</div>
        <PreviousActivitySelector selected={selectedActivity} 
        onSelect={handleSelectActivity} 
        options={optionsDummy} 
        defaultText="Select previous activity"
        activityDate={activityDate}
        activityLocation={activityLocation}
        />
        <Rating rating={rating} setRating={setRating}/>
      </div>
    </main>
  );
}

