'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Progressbar from '~/_components/progress-bar'
import SelectionCard from '../_components/selection-card'
import { useSurvey } from '../SurveyContext'
import Button from '~/_components/button'

import { User as SoloIcon, Users as GroupIcon } from 'lucide-react'
import TextBtn from '~/_components/text-button'

export default function Page() {
  const router = useRouter()
  const {
    travelTypes,
    toggleTravelType,
    clearTravelTypes,
    saveTravelTypes,
    isSaving,
    activityCategories,
    concerns
  } = useSurvey()

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    console.log('Current survey state:', {
      activityCategories,
      concerns,
      travelTypes
    })
  }, [activityCategories, concerns, travelTypes])

  const handleDone = async () => {
    setIsLoading(true)
    
    try {
      console.log('=== SURVEY SUBMISSION DEBUG ===')
      console.log('Saving travel type selections:', travelTypes)
      
      if (travelTypes.length > 0) {
        const success = await saveTravelTypes()
        console.log('Save result:', success ? 'successful' : 'failed')
      }
      
      console.log('Survey completed successfully!')
      console.log('Final survey data:')
      console.log({
        activityPreferences: activityCategories,
        travelConcerns: concerns,
        travelTypes: travelTypes
      })
      
      router.push('/discover')
    } catch (error) {
      console.error('Error completing survey:', error)
      router.push('/discover')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSkip = () => {
    clearTravelTypes()
    router.push('/discover')
  }

  const isButtonDisabled = isLoading || isSaving

  return (
    <main className='font-poppins w-full'>
      <div className='-mt-16 w-full'>
        <Progressbar totalSteps={3} currentStep={3} />
      </div>
      <div className='mt-8 flex flex-col text-center'>
        <h2>Are you a solo or group traveller?</h2>
        <p className='mt-2 text-xs font-semibold'>
          This will help personalize your user feed!
        </p>

        <div className='mt-8 flex w-full gap-4 px-4'>
          <SelectionCard
            variant='card'
            icon={<SoloIcon size={36} />}
            label='Solo'
            isSelected={travelTypes?.includes('solo') ?? false}
            onClick={() => toggleTravelType('solo')}
          />
          <SelectionCard
            variant='card'
            icon={<GroupIcon size={36} />}
            label='Group'
            isSelected={travelTypes?.includes('group') ?? false}
            onClick={() => toggleTravelType('group')}
          />
        </div>

        <div className='mt-12 px-4'>
          <Button
            label={isButtonDisabled ? 'Processing...' : 'Done!'}
            variant='orange'
            rounded='full'
            onClick={handleDone}
            disabled={isButtonDisabled}
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