import React, { useState, useLayoutEffect, useRef } from 'react'
import { SearchFormValues } from '../_types/search'
import { ArrowLeft } from 'lucide-react'
import SearchBar from './search-bar'
import Dropdown from './dropdown'
import TextBox from './text-box'
import TextBtn from './text-button'
import { useSwipeGesture } from '../_hooks/use-swipe-gesture'

interface SearchDrawerProps {
  value: string
  onChange?: (value: string) => void
  onSubmit: (formValues?: SearchFormValues) => void
  onClose: () => void
  placeholder?: string
  // Added new props for initial values
  initialLocation?: string[]
  initialMinPrice?: string
  initialMaxPrice?: string
  initialCategories?: string[]
}

const SearchDrawer: React.FC<SearchDrawerProps> = ({
  value,
  onChange,
  onSubmit,
  onClose,
  placeholder = 'Search...',
  // Default to empty arrays/values for new props
  initialLocation = [],
  initialMinPrice = '',
  initialMaxPrice = '',
  initialCategories = [],
}) => {
  // Initialize state with the passed initial values
  const [selectedLocation, setSelectedLocation] =
    useState<string[]>(initialLocation)
  const [minPrice, setMinPrice] = useState(initialMinPrice)
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice)
  const [selectedCategories, setSelectedCategories] =
    useState<string[]>(initialCategories)

  // Create refs for the TextBox components
  const minPriceRef = useRef<HTMLInputElement>(null)
  const maxPriceRef = useRef<HTMLInputElement>(null)

  // Use our custom hook
  const [translateX, swipeHandlers] = useSwipeGesture({
    direction: 'right',
    onSwipeComplete: onClose,
  })

  useLayoutEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const clearLocation = () => setSelectedLocation([])

  const clearPrice = () => {
    setMinPrice('')
    setMaxPrice('')
  }

  const clearCategories = () => setSelectedCategories([])

  // Handle text input changes
  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinPrice(e.target.value)
  }

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxPrice(e.target.value)
  }

  // Get all form values for submission
  const getFormValues = () => {
    return {
      searchTerm: value,
      location: selectedLocation,
      minPrice: minPrice,
      maxPrice: maxPrice,
      categories: selectedCategories,
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formValues = getFormValues()
    console.log('Form values:', formValues)
    onSubmit(formValues) // Pass the form values to parent
  }

  return (
    <div className='fixed inset-0 z-30 flex justify-center'>
      <div
        className='absolute bottom-28 top-[7.5rem] w-[375px] overflow-y-scroll bg-white'
        style={swipeHandlers.style}
        onTouchStart={swipeHandlers.onTouchStart}
        onTouchMove={swipeHandlers.onTouchMove}
        onTouchEnd={swipeHandlers.onTouchEnd}
      >
        <form onSubmit={handleSubmit} className='flex flex-col gap-y-8 p-6'>
          {/* Back Button and Search Bar */}
          <div className='mb-4 flex flex-col gap-4'>
            <button type='button' onClick={onClose} className='-ml-2 p-2'>
              <ArrowLeft size={24} />
            </button>
            <SearchBar
              placeholder={placeholder}
              defaultValue={value}
              onSearch={onSubmit}
              onChange={onChange}
              enableDrawer={false}
            />
          </div>

          <div className='flex flex-col gap-y-6'>
            {/* Location Dropdown */}
            <div className='flex flex-col gap-y-2'>
              <div className='flex items-center justify-between'>
                <h3>Location</h3>
                {selectedLocation.length > 0 && (
                  <TextBtn text='clear' onClick={clearLocation} />
                )}
              </div>
              <Dropdown
                selected={selectedLocation}
                onSelect={setSelectedLocation}
                defaultText='Select Area'
                options={['Bangkok', 'Chiang Mai', 'Phuket', 'Nan']}
              />
            </div>

            {/* Price Range Inputs */}
            <div className='mt-4 flex flex-col gap-y-2'>
              <div className='flex items-center justify-between'>
                <h3>Price</h3>
                {(minPrice || maxPrice) && (
                  <TextBtn text='clear' onClick={clearPrice} />
                )}
              </div>
              <div className='flex items-center gap-x-2'>
                <TextBox
                  ref={minPriceRef}
                  placeholder='Min'
                  value={minPrice}
                  onChange={handleMinPriceChange}
                  width='100%'
                  textSize='small'
                  variant='light'
                />
                <span className='flex-shrink-0 text-sm'>Baht -</span>
                <TextBox
                  ref={maxPriceRef}
                  placeholder='Max'
                  value={maxPrice}
                  onChange={handleMaxPriceChange}
                  width='100%'
                  textSize='small'
                  variant='light'
                />
                <span className='flex-shrink-0 text-sm'>Baht</span>
              </div>
            </div>

            {/* Category Checkboxes */}
            <div className='mt-4 flex flex-col gap-y-2'>
              <div className='flex items-center justify-between'>
                <h3>Category</h3>
                {selectedCategories.length > 0 && (
                  <TextBtn text='clear' onClick={clearCategories} />
                )}
              </div>
              <Dropdown
                selected={selectedCategories}
                onSelect={setSelectedCategories}
                defaultText='Select Categories'
                options={['Sport', 'Shopping', 'Education', 'Nature', 'Eating', 'Adventure', 'Workshop', 'Religious']}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type='submit'
            className='bg-orange hover:bg-orange/90 mt-6 w-full rounded-lg py-2 text-white transition-colors'
          >
            Search
          </button>
        </form>
      </div>
    </div>
  )
}

export default SearchDrawer
