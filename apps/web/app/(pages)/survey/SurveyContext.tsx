'use client'
import { createContext, useContext, useState, ReactNode } from 'react'

type TravelerType = 'solo' | 'group' | null

interface SurveyContextType {
  // Page 1: Activity preferences
  activityCategories: string[]
  toggleActivityCategory: (category: string) => void
  clearActivityCategories: () => void

  // Page 2: Travel concerns
  travelConcerns: string[]
  toggleTravelConcern: (concern: string) => void
  clearTravelConcerns: () => void

  // Page 3: Traveler type (solo/group)
  travelerType: TravelerType
  setTravelerType: (type: TravelerType) => void
  clearTravelerType: () => void

  submitSurvey: () => Promise<void>
}

const SurveyContext = createContext<SurveyContextType | undefined>(undefined)

export const SurveyProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Separate state for each page
  const [activityCategories, setActivityCategories] = useState<string[]>([])
  const [travelConcerns, setTravelConcerns] = useState<string[]>([])
  const [travelerType, setTravelerType] = useState<TravelerType>(null)

  // Activity categories functions
  const toggleActivityCategory = (category: string) => {
    setActivityCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    )
  }

  const clearActivityCategories = () => {
    setActivityCategories([])
  }

  // Travel concerns functions
  const toggleTravelConcern = (concern: string) => {
    setTravelConcerns((prev) =>
      prev.includes(concern)
        ? prev.filter((c) => c !== concern)
        : [...prev, concern]
    )
  }

  const clearTravelConcerns = () => {
    setTravelConcerns([])
  }

  // Traveler type functions
  const clearTravelerType = () => {
    setTravelerType(null)
  }

  const submitSurvey = async () => {
    const allData = {
      activity_preferences: activityCategories,
      travel_concerns: travelConcerns,
      traveler_type: travelerType || '',
    }

    console.log('📤 Submitting survey data:', JSON.stringify(allData, null, 2))

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // const response = await fetch('/api/survey', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(allData)
      // });

      // if (!response.ok) {
      //   throw new Error(`API error: ${response.status}`);
      // }

      console.log('Survey data submitted successfully')
      return Promise.resolve()
    } catch (error) {
      console.error('Survey submission error:', error)
      return Promise.reject(error)
    }
  }

  return (
    <SurveyContext.Provider
      value={{
        activityCategories,
        toggleActivityCategory,
        clearActivityCategories,
        travelConcerns,
        toggleTravelConcern,
        clearTravelConcerns,
        travelerType,
        setTravelerType,
        clearTravelerType,
        submitSurvey,
      }}
    >
      {children}
    </SurveyContext.Provider>
  )
}

export const useSurvey = () => {
  const context = useContext(SurveyContext)
  if (context === undefined) {
    throw new Error('useSurvey must be used within a SurveyProvider')
  }
  return context
}
