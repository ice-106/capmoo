'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import NameSection from '../../_components/name-section'
import ReviewCard from '../../_components/review-card'
import TextBtn from '~/_components/text-button'
import FooterTemplate from '~/_components/footer-template'
import Button from '~/_components/button'

export default function Page() {
  const router = useRouter()
  const params = useParams()
  const activityId = parseInt(params.id as string, 10)
  // We could use this state for real API data
  // const [activityData, setActivityData] = useState(null);

  // Log the ID from the route
  useEffect(() => {
    console.log('Activity ID from route:', activityId)

    // In a real scenario, we would fetch data based on the ID
    // fetchActivityData(activityId).then(data => setActivityData(data));
    // For now, we'll continue using mock data
  }, [activityId])

  const handleBooking = () => {
    console.log('Book clicked')
    router.push(`/activity/${activityId}/booking`)
  }

  // Use the route ID in the mock data
  const mockData = [
      {
        "id": 0,
        "images": [
          { "src": "/images/activity/user/activity_1.jpg" },
        ],
        "rating": 4.7,
        "name": "The Sahur at Wat Phra Kaew 🛕✨",
        "date": "May 15, 2025",
        "location": "Bangkok",
        "price": "100 Baht/person",
        "description": "Experience the joy of playing with friendly horses in a beautiful outdoor setting at Rongbom Rimnam. This activity offers a relaxing and fun opportunity to connect with these graceful animals. Spend your time interacting with the horses, and enjoy taking pictures with them to capture unforgettable moments. Perfect for anyone who loves animals or simply wants to add a special touch to their photo album. It’s an easy-going activity for families, friends, or individuals looking to have a fun and memorable time with horses."
      },
      {
        "id": 1,
        "images": [
          { "src": "/images/activity/user/activity_1.jpg" },
        ],
        "rating": 4.7,
        "name": "The Sahur at Wat Phra Kaew 🛕✨",
        "date": "May 15, 2025",
        "location": "Bangkok",
        "price": "100 Baht/person",
        "description": "Experience the joy of playing with friendly horses in a beautiful outdoor setting at Rongbom Rimnam. This activity offers a relaxing and fun opportunity to connect with these graceful animals. Spend your time interacting with the horses, and enjoy taking pictures with them to capture unforgettable moments. Perfect for anyone who loves animals or simply wants to add a special touch to their photo album. It’s an easy-going activity for families, friends, or individuals looking to have a fun and memorable time with horses."
      },
      {
        "id": 2,
        "images": [
          { "src": "/images/activity/user/activity_2.jpg" },
        ],
        "rating": 4.7,
        "name": "Siam amazing kod zing kod zaddd 🗣🗣🔊🔊‼",
        "date": "May 15, 2025",
        "location": "Siam, Bangkok",
        "price": "100 Baht/person",
        "description": "Experience the joy of playing with friendly horses in a beautiful outdoor setting at Rongbom Rimnam. This activity offers a relaxing and fun opportunity to connect with these graceful animals. Spend your time interacting with the horses, and enjoy taking pictures with them to capture unforgettable moments. Perfect for anyone who loves animals or simply wants to add a special touch to their photo album. It’s an easy-going activity for families, friends, or individuals looking to have a fun and memorable time with horses."
      },
      {
        "id": 3,
        "images": [
          { "src": "/images/activity/user/activity_3.jpg" },
        ],
        "rating": 4.7,
        "name": "Sahur pa tour Sea Life Bangkok 🐟🦈🌊",
        "date": "May 15, 2025",
        "location": "Bangkok",
        "price": "100 Baht/person",
        "description": "Experience the joy of playing with friendly horses in a beautiful outdoor setting at Rongbom Rimnam. This activity offers a relaxing and fun opportunity to connect with these graceful animals. Spend your time interacting with the horses, and enjoy taking pictures with them to capture unforgettable moments. Perfect for anyone who loves animals or simply wants to add a special touch to their photo album. It’s an easy-going activity for families, friends, or individuals looking to have a fun and memorable time with horses."
      },
      {
        "id": 4,
        "images": [
          { "src": "/images/activity/user/activity_4.jpg" },
        ],
        "rating": 4.7,
        "name": "Safari world - POV - HumKungLnw 😎",
        "date": "May 15, 2025",
        "location": "Safari World, Bangkok",
        "price": "100 Baht/person",
        "description": "Experience the joy of playing with friendly horses in a beautiful outdoor setting at Rongbom Rimnam. This activity offers a relaxing and fun opportunity to connect with these graceful animals. Spend your time interacting with the horses, and enjoy taking pictures with them to capture unforgettable moments. Perfect for anyone who loves animals or simply wants to add a special touch to their photo album. It’s an easy-going activity for families, friends, or individuals looking to have a fun and memorable time with horses."
      },
      {
        "id": 5,
        "images": [
          { "src": "/images/activity/user/activity_5.jpg" },
        ],
        "rating": 4.7,
        "name": "Birthday at Dream world ✨ !!!",
        "date": "Dream World, Bangkok",
        "location": "Rongbom Rimnam",
        "price": "100 Baht/person",
        "description": "Experience the joy of playing with friendly horses in a beautiful outdoor setting at Rongbom Rimnam. This activity offers a relaxing and fun opportunity to connect with these graceful animals. Spend your time interacting with the horses, and enjoy taking pictures with them to capture unforgettable moments. Perfect for anyone who loves animals or simply wants to add a special touch to their photo album. It’s an easy-going activity for families, friends, or individuals looking to have a fun and memorable time with horses."
      },
      {
        "id": 6,
        "images": [
          { "src": "/images/activity/user/activity_6.jpg" },
        ],
        "rating": 4.7,
        "name": "One day trip Bang Krachao cycling 🚴‍♀️",
        "date": "May 15, 2025",
        "location": "Bang Krachao, Bangkok",
        "price": "100 Baht/person",
        "description": "Experience the joy of playing with friendly horses in a beautiful outdoor setting at Rongbom Rimnam. This activity offers a relaxing and fun opportunity to connect with these graceful animals. Spend your time interacting with the horses, and enjoy taking pictures with them to capture unforgettable moments. Perfect for anyone who loves animals or simply wants to add a special touch to their photo album. It’s an easy-going activity for families, friends, or individuals looking to have a fun and memorable time with horses."
      },
      {
        "id": 7,
        "images": [
          { "src": "/images/activity/user/activity_7.jpg" },
          { "src": "/images/activity/user/activity_7_2.jpg" },
          { "src": "/images/activity/user/activity_7_3.jpg" }
        ],
        "rating": 4.7,
        "name": "Playing and Taking Pictures with Horse",
        "date": "May 15, 2025",
        "location": "Rongbom Rimnam",
        "price": "100 Baht/person",
        "description": "Experience the joy of playing with friendly horses in a beautiful outdoor setting at Rongbom Rimnam. This activity offers a relaxing and fun opportunity to connect with these graceful animals. Spend your time interacting with the horses, and enjoy taking pictures with them to capture unforgettable moments. Perfect for anyone who loves animals or simply wants to add a special touch to their photo album. It’s an easy-going activity for families, friends, or individuals looking to have a fun and memorable time with horses."
      },
      {
        "id": 8,
        "images": [
          { "src": "/images/activity/user/activity_8.jpg" },
          { "src": "/images/activity/user/activity_8_2.jpg" },
          { "src": "/images/activity/user/activity_8_3.jpg" },
          { "src": "/images/activity/user/activity_8_4.jpg" },
          { "src": "/images/activity/user/activity_8_5.jpg" },
          { "src": "/images/activity/user/activity_8_6.jpg" }
        ],
        "rating": 4.8,
        "name": "River Seaweed Harvesting Adventure",
        "date": "May 20, 2025",
        "location": "Rongbom Rimnam",
        "price": "300 Baht/person",
        "description": "Join us for an exciting and hands-on river seaweed harvesting experience at Rongbom Rimnam! Glide along the river on a bamboo raft, collect fresh seaweed, and learn about the traditional harvesting techniques used by locals. This fun and educational activity allows you to connect with nature, explore the river, and capture memorable moments with friends and family. Perfect for those looking for a unique outdoor adventure that blends nature, tradition, and photography!"
      },
      {
        "id": 9,
        "images": [
          { "src": "/images/activity/user/activity_9.jpg" },
          { "src": "/images/activity/user/activity_9_2.jpg" },
          { "src": "/images/activity/user/activity_9_3.jpg" },
          { "src": "/images/activity/user/activity_9_4.jpg" },
          { "src": "/images/activity/user/activity_9_5.jpg" },
          { "src": "/images/activity/user/activity_9_6.jpg" },
          { "src": "/images/activity/user/activity_9_7.jpg" },
          { "src": "/images/activity/user/activity_9_8.jpg" },
        ],
        "rating": 4.9,
        "name": "Kayaking Along Nan River",
        "date": "May 25, 2025",
        "location": "Nan River, Rongbom Rimnam",
        "price": "350 Baht/person",
        "description": "Set off on an unforgettable adventure kayaking along the peaceful Nan River at Rongbom Rimnam! Paddle through tranquil waters, surrounded by lush nature and beautiful landscapes. Whether you're kayaking solo or with a partner, this activity provides a perfect escape into nature, ideal for both beginners and experienced kayakers. Enjoy the calm of the river, spot local wildlife, and capture stunning views while having fun on the water. It's the perfect way to unwind and explore the scenic beauty of the region."
      }
    ]
  

  const mockReviewData = [
      {
        "profileImgUrl": "/images/default_profile.png",
        "userName": "TungDudeCarryThailand",
        "reviewText": "I had an amazing experience at Rongbom Rimnam! The horses were so friendly, and the location was beautiful. It was a great way to spend the day with friends and take some memorable photos. Highly recommend it for anyone looking to enjoy nature and animals!",
        "reviewUrl": "7"
      },
      {
        "profileImgUrl": "/images/default_profile.png",
        "userName": "KikiLittleWitch",
        "reviewText": "The river seaweed harvesting was such a fun and unique activity! I loved the bamboo raft ride, and it was so interesting learning about the local techniques. The guides were super knowledgeable and made the experience even better. I can't wait to come back for more adventures!",
        "reviewUrl": "8"
      },
      {
        "profileImgUrl": "/images/default_profile.png",
        "userName": "MildWannaGoToSleep",
        "reviewText": "Kayaking along Nan River was so peaceful and relaxing. The scenery was absolutely stunning, and paddling through the calm waters was a perfect way to unwind. Even as a beginner, I felt very comfortable, and the guides made sure we had an awesome time. Definitely worth the experience!",
        "reviewUrl": "9"
      }
    ]
  
  const activity = mockData[activityId] || mockData[0];


  return (
    <main className='font-poppins w-full'>
      <NameSection
        images={activity!.images}
        rating={activity!.rating}
        name={activity!.name}
        date={activity!.date}
        location={activity!.location}
        price={activity!.price}
      />
      <div className='mb-8 flex w-full flex-col gap-y-8'>
        <section className='border-lightgrey w-full rounded-lg border p-2'>
          <b>Description</b> <br />
          {activity!.description}
        </section>
        <section className='flex w-full flex-col gap-y-2'>
          <span className='flex w-full justify-between'>
            <h3>Read Reviews</h3>
            <TextBtn
              text='Read all reviews'
              onClick={() => router.push(`/reviews?q=${activity!.name}`)}
            />
          </span>
          {mockReviewData.map((review, index) => (
            <ReviewCard
              key={index}
              profileImgUrl={review.profileImgUrl}
              userName={review.userName}
              reviewText={review.reviewText}
              reviewUrl={review.reviewUrl}
            />
          ))}
        </section>
        <span className='text-lightgrey text-center text-xs'>
          That&apos;s all for now {':)'}
        </span>
      </div>
      <FooterTemplate>
        <div className='flex gap-x-4'>
          <Button
            label='Save to Schedule'
            variant='default'
            rounded='lg'
            onClick={() => console.log('Save to Schedule clicked')}
          />
          <Button
            label='Book Now'
            variant='orange'
            rounded='lg'
            onClick={handleBooking}
          />
        </div>
      </FooterTemplate>
    </main>
  )
}
