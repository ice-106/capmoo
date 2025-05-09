'use client'

import { useRouter } from 'next/navigation'
import { SearchFormValues } from '../../_types/search'
import Header from '../../_components/header'
import Footer from '../../_components/footer'
import Carousel from '../../_components/carousel'
import SearchBar from '../../_components/search-bar'
import { useAxios } from '~/_lib/axios'
import { useEffect, useState } from 'react'

export default function Page() {
  const axios = useAxios()
  const router = useRouter()

  const [activities, setActivities] = useState<
    | {
        imgUrl: string
        text: string
        onClickUrl: string
      }[]
    | []
  >([])

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get('/v1/activities/search')

        const mappedActivities = response.data.data.map((activity: any) => ({
          imgUrl: activity.images[0],
          text: activity.name,
          onClickUrl: `/activity/${activity.id}/description`,
        }))

        setActivities(mappedActivities)
      } catch (error) {
        console.error('Error fetching activities:', error)
      }
    }

    fetchActivities()
  }, [])

  const imgArrayPopular = [
    {
      imgUrl: '/images/activity/user/activity_9.jpg',
      text: 'Kayaking Along Nan River',
      onClickUrl: '/activity/9/description',
    },
    {
      imgUrl: '/images/activity/user/activity_1.jpg',
      text: 'Wat Phra Kaew',
      onClickUrl: '/activity/1/description',
    },
    {
      imgUrl: '/images/activity/user/activity_2.jpg',
      text: 'Siam Amazing Park',
      onClickUrl: '/activity/2/description',
    },
    {
      imgUrl: '/images/activity/user/activity_3.jpg',
      text: 'Safari World',
      onClickUrl: '/activity/3/description',
    },
  ]

  const imgArrayUpcoming = [
    {
      imgUrl: '/images/activity/user/activity_4.jpg',
      text: 'Dream World',
      onClickUrl: '/activity/4/description',
    },
    {
      imgUrl: '/images/activity/user/activity_5.jpg',
      text: 'Bang Krachao',
      onClickUrl: '/activity/5/description',
    },
    {
      imgUrl: '/images/activity/user/activity_6.jpg',
      text: 'Sea Life Bangkok',
      onClickUrl: '/activity/6/description',
    },
    {
      imgUrl: '/images/activity/user/activity_7.jpg',
      text: 'Playing and Taking Pictures with Horse',
      onClickUrl: '/activity/7/description',
    },
    {
      imgUrl: '/images/activity/user/activity_8.jpg',
      text: 'River Seaweed Harvesting Adventure',
      onClickUrl: '/activity/8/description',
    },
  ]

  // Function to convert form values to URL parameters
  const formValuesToUrlParams = (formValues: SearchFormValues) => {
    const params = new URLSearchParams()

    // Add search term if it exists
    if (formValues.searchTerm) params.append('q', formValues.searchTerm)

    // Add location if selected
    if ((formValues.location ?? []).length > 0) {
      ;(formValues.location ?? []).forEach((loc: string) => {
        params.append('location', loc)
      })
    }

    // Add price range if provided
    if (formValues.minPrice) params.append('minPrice', formValues.minPrice)
    if (formValues.maxPrice) params.append('maxPrice', formValues.maxPrice)

    // Add categories if selected
    if ((formValues.categories ?? []).length > 0) {
      ;(formValues.categories ?? []).forEach((cat: string) => {
        params.append('category', cat)
      })
    }

    return params.toString()
  }

  // Handler for search submission
  const handleSearch = (formValues?: SearchFormValues) => {
    if (formValues) {
      // Convert form values to URL parameters
      const urlParams = formValuesToUrlParams(formValues)

      if (!urlParams) {
        return
      }

      // Log the URL that would be created
      console.log(`Would navigate to: /discover/search?${urlParams}`)

      router.push(`/discover/search?${urlParams}`)
    }
  }

  return (
    <main className='font-poppins w-full'>
      <Header text='Discover' />
      <Footer />
      <div className='flex flex-col gap-y-8'>
        <SearchBar
          placeholder='Search...'
          onSearch={handleSearch}
          enableDrawer
        />
        <Carousel
          header='Popular Activities'
          images={activities}
          exploreLink='/discover'
        />
        <Carousel
          header='Upcoming Activities'
          images={activities.reverse()}
          exploreLink='/discover'
        />
      </div>
    </main>
  )
}
