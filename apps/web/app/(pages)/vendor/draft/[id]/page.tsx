"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import NameSection from '../../../activity/_components/nameSection';
import FooterTemplate from '../../../../_components/footerTemplate';
import Button from '../../../../_components/Button';
import BackButton from '../../../../_components/BackButton';


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

  const handlePost = () => {
    console.log("Activity Posted");
    router.push(`/vendor/activity`);
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

  return (
    <main className="font-poppins w-full">
      <div className="fixed flex w-full h-24 top-0 left-0 right-0 justify-center items-end p-4 bg-white z-10">
      <div className="w-[375px] flex items-center justify-between px-4">
        <BackButton/>
      </div>
      </div>
      <NameSection 
        images={mockData.images}
        rating={mockData.rating}
        name={mockData.name}
        date={mockData.date}
        location={mockData.location}
        price={mockData.price} 
      />
      <div className='w-[130px] px-2 mb-4 border-2 border-grey bg-[#D9D9D9] rounded-lg'>Status: Draft</div>
      <div className="w-full flex flex-col gap-y-8 mb-8">
        <section className="w-full p-2 border border-lightgrey rounded-lg">
          <b>Description</b> <br/>
          {mockData.description}
        </section>
      </div>
      <FooterTemplate>
        <div className="flex gap-x-4">
          <Button
            label="Delete"
            variant="default"  
            rounded="lg"      
            onClick={() => console.log("Delete")}
            />
            <Button
            label="Edit"
            variant="default"  
            rounded="lg"      
            onClick={() => 
              {console.log("Edit")
                router.push("/vendor/create-activity")
              }}
            />
            <Button
            label="Post"
            variant="orange"    
            rounded="lg"    
            onClick={handlePost}
            />
        </div>
      </FooterTemplate>
    </main>
  );
}
