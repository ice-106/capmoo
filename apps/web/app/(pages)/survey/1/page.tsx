'use client'

import { useRouter } from 'next/navigation'
import Progressbar from '~/_components/progress-bar'
import SelectionCard from '../_components/selection-card'
import { useSurvey } from '../SurveyContext'
import Button from '~/_components/button'
import { useEffect, useState } from 'react'

import {
  Volleyball as SportIcon,
  ShoppingBag as ShoppingIcon,
  BookMarked as EducationIcon,
  Sprout as NatureIcon,
  Pizza as EatingIcon,
  Mountain as AdventureIcon,
  Wrench as WorkshopIcon,
  Church as ReligiousIcon,
} from 'lucide-react'
import TextBtn from '~/_components/text-button'

export default function Page() {
  const router = useRouter()
  const {
    activityCategories,
    toggleActivityCategory,
    clearActivityCategories,
    saveActivityPreferences,
    isSaving
  } = useSurvey()

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (activityCategories.length > 0) {
      console.log('Current activity selections:', activityCategories)
    }
  }, [activityCategories])

  const categoryOptions = [
    { id: 'sports', label: 'Sports', icon: <SportIcon size={24} /> },
    { id: 'shopping', label: 'Shopping', icon: <ShoppingIcon size={24} /> },
    {
      id: 'educational',
      label: 'Educational',
      icon: <EducationIcon size={24} />,
    },
    { id: 'nature', label: 'Nature', icon: <NatureIcon size={24} /> },
    { id: 'eating', label: 'Eating', icon: <EatingIcon size={24} /> },
    { id: 'adventure', label: 'Adventure', icon: <AdventureIcon size={24} /> },
    { id: 'workshop', label: 'Workshop', icon: <WorkshopIcon size={24} /> },
    { id: 'religious', label: 'Religious', icon: <ReligiousIcon size={24} /> },
  ]

  const handleNext = async () => {
    setIsLoading(true)
    
    try {
      console.log('Saving activity selections:', activityCategories)
      
      if (activityCategories.length > 0) {
        const success = await saveActivityPreferences()
        console.log('Save result:', success ? 'successful' : 'failed')
      }
      
      router.push('/survey/2')
    } catch (error) {
      console.error('Error saving preferences:', error)
      router.push('/survey/2')
    }
  }

  const handleSkip = () => {
    console.log('Skipping page 1: Clearing activity selections')
    clearActivityCategories()
    router.push('/survey/2')
  }

  return (
    <main className='font-poppins w-full'>
      <div className='-mt-16 w-full'>
        <Progressbar totalSteps={3} currentStep={1} />
      </div>
      <div className='mt-8 flex flex-col text-center'>
        <h2>Which types of activities you mostly preferred?</h2>
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
                isSelected={activityCategories.includes(category.id)}
                onClick={() => toggleActivityCategory(category.id)}
              />
            ))}
          </div>
        </div>

        <div className='mt-12 px-4'>
          <Button
            label={(isLoading || isSaving) ? 'Processing...' : 'Next'}
            variant='orange'
            rounded='full'
            onClick={handleNext}
            disabled={isLoading || isSaving}
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
