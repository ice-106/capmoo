'use client'

import { useRouter } from 'next/navigation'
import Progressbar from '~/_components/progress-bar'
import SelectionCard from '../_components/selection-card'
import { useSurvey } from '../SurveyContext'
import Button from '~/_components/button'
import { useEffect } from 'react'

import {
  DollarSign as PriceIcon,
  ClockArrowUp as AvailabilityIcon,
  BadgePercent as PromotionIcon,
  Star as RatingIcon,
  ChartNoAxesColumnIncreasing as PopularityIcon,
  MapPin as LocationIcon,
} from 'lucide-react'
import TextBtn from '~/_components/text-button'

export default function Page() {
  const router = useRouter()
  const { travelConcerns, toggleTravelConcern, clearTravelConcerns } =
    useSurvey()

  useEffect(() => {
    if (travelConcerns.length > 0) {
      console.log('Current travel concern selections:', travelConcerns)
    }
  }, [travelConcerns])

  const categoryOptions = [
    { id: 'price', label: 'Price', icon: <PriceIcon size={24} /> },
    {
      id: 'availability',
      label: 'Availability',
      icon: <AvailabilityIcon size={24} />,
    },
    { id: 'promotion', label: 'Promotion', icon: <PromotionIcon size={24} /> },
    { id: 'rating', label: 'Rating', icon: <RatingIcon size={24} /> },
    {
      id: 'popularity',
      label: 'Popularity',
      icon: <PopularityIcon size={24} />,
    },
    { id: 'location', label: 'Location', icon: <LocationIcon size={24} /> },
  ]

  const handleNext = () => {
    console.log('Keeping travel concern selections:', travelConcerns)
    router.push('/survey/3')
  }

  const handleSkip = () => {
    console.log('Skipping page 2: Clearing travel concern selections')
    clearTravelConcerns()
    router.push('/survey/3')
  }

  return (
    <main className='font-poppins w-full'>
      <div className='-mt-16 w-full'>
        <Progressbar totalSteps={3} currentStep={2} />
      </div>
      <div className='mt-8 flex flex-col text-center'>
        <h2>What are your main concerns when travelling?</h2>
        <p className='mt-2 text-xs font-semibold'>
          This will help personalize your user feed!
        </p>

        <div className='mt-8 flex flex-col gap-3'>
          <div className='grid grid-cols-2 gap-3'>
            {categoryOptions.map((category) => (
              <SelectionCard
                variant='icon'
                key={category.id}
                label={category.label}
                icon={category.icon}
                isSelected={travelConcerns.includes(category.id)}
                onClick={() => toggleTravelConcern(category.id)}
              />
            ))}
          </div>
        </div>

        <div className='mt-12 px-4'>
          <Button
            label='Next'
            variant='orange'
            rounded='full'
            onClick={handleNext}
          />

          <div className='mt-3 text-center'>
            <TextBtn
              text='Skip this step'
              className='text-grey text-xs underline'
              onClick={handleSkip}
            />
          </div>
        </div>
      </div>
    </main>
  )
}
