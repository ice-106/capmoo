'use client'

import { useRouter } from 'next/navigation'
import { SearchFormValues } from '~/_types/search'
import Header from '~/_components/header'
import Carousel from '~/_components/carousel'
import SearchBar from '~/_components/search-bar'
import VendorFooter from '~/_components/vendor-footer'

export default function Page() {
  const router = useRouter()

  const imgArrayActive = [
    {
      imgUrl: '/images/activity/vendor/activity_1.jpg',
      text: 'Domain clash - Powered by Capmoo',
      onClickUrl: '/vendor/active/1',
    },
    {
      imgUrl: '/images/activity/vendor/activity_2.jpg',
      text: 'Italian vocab contest 🦈🐊',
      onClickUrl: '/vendor/active/2',
    },
    {
      imgUrl: '/images/activity/vendor/activity_3.png',
      text: 'Sleep workshop 💤😴🛌',
      onClickUrl: '/vendor/active/3',
    },
  ]

  const imgArrayEnded = [
    {
      imgUrl: '/images/activity/vendor/activity_4.jpg',
      text: 'Pray together 🙏🤲 Enlightenment 101',
      onClickUrl: '/vendor/ended/1',
    },
    {
      imgUrl: '/images/activity/vendor/activity_5.jpg',
      text: 'Grand Prix 2025 - บางบ่อ circuit',
      onClickUrl: '/vendor/ended/2',
    },
    {
      imgUrl: '/images/activity/vendor/activity_6.jpg',
      text: 'Build anything but boat 🥀🥀💔💔',
      onClickUrl: '/vendor/ended/3',
    },
  ]

  const imgArrayDraft = [
    {
      imgUrl: '/images/activity/vendor/activity_7.jpg',
      text: 'Super marathon',
      onClickUrl: '/vendor/draft/1',
    },
    {
      imgUrl: '/images/activity/vendor/activity_8.jpg',
      text: 'Protest - block roads',
      onClickUrl: '/vendor/draft/2',
    },
    {
      imgUrl: '/images/activity/vendor/activity_9.jpeg',
      text: 'Horse riding',
      onClickUrl: '/vendor/draft/3',
    },
  ]

  // Function to convert form values to URL parameters
  const formValuesToUrlParams = (formValues: SearchFormValues) => {
    const params = new URLSearchParams()

    // Add search term if it exists
    if (formValues.searchTerm) params.append('q', formValues.searchTerm)

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
      <Header text='My Activities' />
      <VendorFooter />
      <div className='flex flex-col gap-y-8'>
        <SearchBar
          placeholder='Search...'
          onSearch={handleSearch}
          enableDrawer={false}
        />
        <Carousel
          header='Active Activities'
          images={imgArrayActive}
          exploreLink='/vendor/activity'
        />
        <Carousel
          header='Ended Activities'
          images={imgArrayEnded}
          exploreLink='/vendor/activity'
        />
        <Carousel
          header='Drafted Activities'
          images={imgArrayDraft}
          exploreLink='/vendor/activity'
        />
      </div>
    </main>
  )
}
