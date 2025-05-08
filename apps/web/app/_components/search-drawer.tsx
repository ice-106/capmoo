import React, { useState, useLayoutEffect, useRef, useEffect } from 'react'
import { SearchFormValues } from '../_types/search'
import { ArrowLeft } from 'lucide-react'
import SearchBar from './search-bar'
import Dropdown from './dropdown'
import TextBox from './text-box'
import TextBtn from './text-button'
import { useSwipeGesture } from '../_hooks/use-swipe-gesture'
import { useAxios } from '~/_lib/axios'

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
  const axios = useAxios()
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
  const [locations, setLocations] = useState<{ id: number, province: string }[]>([])
  const [categories, setCategories] = useState<{ id: number, name: string }[]>([])

  // Use our custom hook
  const [translateX, swipeHandlers] = useSwipeGesture({
    direction: 'right',
    onSwipeComplete: onClose,
  })

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get('/v1/activities/locations')
        setLocations(response.data.data)
      } catch (error) {
        console.error('Error fetching locations:', error)
      }
    }

    const fetchCategories = async () => {
      try {
        const response = await axios.get('/v1/activities/categories')
        setCategories(response.data.data)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    // Fetch locations and categories when the component mounts
    fetchCategories()
    fetchLocations()
  }, [])

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
                selected={selectedLocation.map((id) => locations.find((loc) => loc.id === Number(id))?.province || '')}
                onSelect={(selectedProvinces) => {
                  const selectedIds = selectedProvinces.map(
                    (province) => locations.find((loc) => loc.province === province)?.id || 0
                  )
                  setSelectedLocation(selectedIds.filter((id) => id !== 0).map(String))
                }}
                defaultText='Select Area'
                options={locations.map((location) => location.province)}
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
                selected={selectedCategories.map((id) => categories.find((cat) => cat.id === Number(id))?.name || '')}
                onSelect={(selectedNames) => {
                  const selectedIds = selectedNames.map(
                    (name) => categories.find((cat) => cat.name === name)?.id || 0
                  )
                  setSelectedCategories(selectedIds.filter((id) => id !== 0).map(String))
                }}
                defaultText='Select Categories'
                options={categories.map((category) => category.name)}
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
