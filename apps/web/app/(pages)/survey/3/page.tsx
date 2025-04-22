'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Progressbar from '~/_components/progress-bar'
import SelectionCard from '../_components/selection-card'
import { useSurvey } from '../SurveyContext'
import Button from '~/_components/button'

import { User as SoloIcon, Users as GroupIcon } from 'lucide-react'
import TextBtn from '~/_components/text-button'

export default function Page() {
  const router = useRouter()
  const {
    travelerType,
    setTravelerType,
    clearTravelerType,
    submitSurvey,
    activityCategories,
    travelConcerns,
  } = useSurvey()

  useEffect(() => {
    console.log('Current survey state:', {
      activityCategories,
      travelConcerns,
      travelerType,
    })
  }, [activityCategories, travelConcerns, travelerType])

  const handleDone = async () => {
    console.log('=== SURVEY SUBMISSION DEBUG ===')
    console.log('Preparing to submit the following data:')

    const previewData = {
      questions: {
        '1_activity_preferences': activityCategories,
        '2_travel_concerns': travelConcerns,
        '3_traveler_type': travelerType || '',
      },
    }

    console.log(JSON.stringify(previewData, null, 2))
    console.log('==============================')

    try {
      await submitSurvey()
      console.log('Survey submitted successfully!')
      router.push('/discover')
    } catch (error) {
      console.error('Survey submission failed:', error)
    }
  }

  const handleSkip = async () => {
    console.log('Skipping page 3: Clearing traveler type selection')
    clearTravelerType()

    console.log('Submitting with skipped data:')

    const finalData = {
      questions: {
        '1_activity_preferences': activityCategories,
        '2_travel_concerns': travelConcerns,
        '3_traveler_type': '',
      },
    }

    console.log(JSON.stringify(finalData, null, 2))

    // Submit the survey even when skipping
    try {
      await submitSurvey()
      console.log('Survey submitted successfully (with skipped step)!')
      router.push('/discover')
    } catch (error) {
      console.error('Survey submission failed:', error)
    }
  }

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
            isSelected={travelerType === 'solo'}
            onClick={() => {
              setTravelerType('solo')
              console.log('Selected traveler type: solo')
            }}
          />
          <SelectionCard
            variant='card'
            icon={<GroupIcon size={36} />}
            label='Group'
            isSelected={travelerType === 'group'}
            onClick={() => {
              setTravelerType('group')
              console.log('Selected traveler type: group')
            }}
          />
        </div>

        <div className='mt-12 px-4'>
          <Button
            label='Done !'
            variant='orange'
            rounded='full'
            onClick={handleDone}
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
