'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect, useCallback, useMemo, Suspense } from 'react'
import { SearchFormValues } from '~/_types/search'
import Header from '~/_components/header'
import Footer from '~/_components/footer'
import SearchBar from '~/_components/search-bar'
import Masonry from '~/_components/masonry'
import { ImageItem } from '~/_types/images'
import { useSwipeGesture } from '~/_hooks/use-swipe-gesture'
import FilterTag from '~/_components/filter-tag'
import SearchDrawer from '~/_components/search-drawer'
import TextBtn from '~/_components/text-button'

export function SearchResultsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [results, setResults] = useState<ImageItem[]>([])

  const [translateX, swipeHandlers] = useSwipeGesture({
    direction: 'right',
    onSwipeComplete: () => router.push('/discover'),
  })

  // Function to open search drawer
  const openSearchDrawer = useCallback(() => {
    setIsDrawerOpen(true)
  }, [])

  // Function to close search drawer
  const closeSearchDrawer = useCallback(() => {
    setIsDrawerOpen(false)
  }, [])

  // Use useMemo to stabilize the queryParams object
  const queryParams = useMemo(
    () => ({
      q: searchParams.get('q') || '',
      locations: searchParams.getAll('location'),
      minPrice: searchParams.get('minPrice'),
      maxPrice: searchParams.get('maxPrice'),
      categories: searchParams.getAll('category'),
    }),
    [searchParams]
  ) // Only depends on searchParams object

  // Load mock search results - only depends on primitive values
  useEffect(() => {
    const defaultImageUrl = '/images/default_profile.png'

    // Mock results based on search parameters
    const mockResults = [
      {
        imgUrl: defaultImageUrl,
        text: 'Result 1' + (queryParams.q ? ` for "${queryParams.q}"` : ''),
        onClickUrl: '/',
      },
      {
        imgUrl: defaultImageUrl,
        text:
          'Result 2' +
          (queryParams.locations.length
            ? ` in ${queryParams.locations.join(', ')}`
            : ''),
        onClickUrl: '/',
      },
      {
        imgUrl: defaultImageUrl,
        text:
          'Result 3' +
          (queryParams.minPrice ? ` min price ${queryParams.minPrice}` : ''),
        onClickUrl: '/',
      },
      {
        imgUrl: defaultImageUrl,
        text:
          'Result 4' +
          (queryParams.maxPrice ? ` max price ${queryParams.maxPrice}` : ''),
        onClickUrl: '/',
      },
      {
        imgUrl: defaultImageUrl,
        text:
          'Result 5' +
          (queryParams.categories.length
            ? ` (${queryParams.categories.join(', ')})`
            : ''),
        onClickUrl: '/',
      },
      { imgUrl: defaultImageUrl, text: 'Result 6', onClickUrl: '/' },
    ]

    setResults(mockResults)
  }, [
    queryParams.q,
    queryParams.locations, // ESLint will now recognize this dependency
    queryParams.minPrice,
    queryParams.maxPrice,
    queryParams.categories, // ESLint will now recognize this dependency
  ])

  // Function to convert form values to URL parameters
  const formValuesToUrlParams = useCallback((formValues: SearchFormValues) => {
    const params = new URLSearchParams()

    if (formValues.searchTerm) params.append('q', formValues.searchTerm)

    if ((formValues.location ?? []).length > 0) {
      ;(formValues.location ?? []).forEach((loc: string) => {
        params.append('location', loc)
      })
    }

    if (formValues.minPrice) params.append('minPrice', formValues.minPrice)
    if (formValues.maxPrice) params.append('maxPrice', formValues.maxPrice)

    if ((formValues.categories ?? []).length > 0) {
      ;(formValues.categories ?? []).forEach((cat: string) => {
        params.append('category', cat)
      })
    }

    return params.toString()
  }, [])

  // Handler for search submission
  const handleSearch = useCallback(
    (formValues?: SearchFormValues) => {
      if (formValues) {
        const urlParams = formValuesToUrlParams(formValues)
        router.push(`/discover/search?${urlParams}`)
      }
    },
    [formValuesToUrlParams, router]
  )

  return (
    <main
      className='font-poppins mx-auto w-full max-w-screen-md p-4'
      onTouchStart={swipeHandlers.onTouchStart}
      onTouchMove={swipeHandlers.onTouchMove}
      onTouchEnd={swipeHandlers.onTouchEnd}
    >
      <Header text='Discover' />

      <div className='mb-6'>
        <SearchBar
          placeholder='Search...'
          defaultValue={queryParams.q}
          onSearch={handleSearch}
          enableDrawer
          initialLocation={queryParams.locations}
          initialMinPrice={queryParams.minPrice || ''}
          initialMaxPrice={queryParams.maxPrice || ''}
          initialCategories={queryParams.categories}
        />

        <div className='text-darkgrey mt-4 flex w-full items-start'>
          {/* Applied filters summary */}
          <div className='flex w-full flex-wrap justify-between gap-2'>
            {queryParams.locations.map((loc, i) => (
              <FilterTag key={i} onClick={openSearchDrawer}>
                Location: {loc}
              </FilterTag>
            ))}

            {(queryParams.minPrice || queryParams.maxPrice) && (
              <FilterTag onClick={openSearchDrawer}>
                Price: {queryParams.minPrice || '0'} -{' '}
                {queryParams.maxPrice || 'Any'} Baht
              </FilterTag>
            )}

            {queryParams.categories.map((cat, i) => (
              <FilterTag key={i} onClick={openSearchDrawer}>
                Category: {cat}
              </FilterTag>
            ))}
            {queryParams.categories.length == 0 &&
              queryParams.locations.length == 0 &&
              queryParams.maxPrice == null &&
              queryParams.minPrice == null && <p>No filter selected</p>}
            <TextBtn text='edit' onClick={openSearchDrawer} />
          </div>
        </div>
      </div>

      {/* Results section */}
      <div className='min-h-[300px]'>
        {results.length > 0 ? (
          <Masonry images={results} />
        ) : (
          <div className='py-12 text-center'>
            <h3 className='mb-2 text-xl'>No results found</h3>
            <p className='text-darkgrey'>Try adjusting your search filters</p>
          </div>
        )}
      </div>
      {/* Render the drawer when needed */}
      {isDrawerOpen && (
        <SearchDrawer
          value={queryParams.q}
          onChange={() => {}}
          onSubmit={(formValues) => {
            handleSearch(formValues)
            closeSearchDrawer()
          }}
          onClose={closeSearchDrawer}
          placeholder='Search...'
          initialLocation={queryParams.locations}
          initialMinPrice={queryParams.minPrice || ''}
          initialMaxPrice={queryParams.maxPrice || ''}
          initialCategories={queryParams.categories}
        />
      )}

      <Footer />
    </main>
  )
}

export default function Page() {
  return (
    <Suspense>
      <SearchResultsPage />
    </Suspense>
  )
}
