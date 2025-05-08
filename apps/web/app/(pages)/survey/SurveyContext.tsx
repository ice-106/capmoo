'use client'

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { useAuth } from 'react-oidc-context'
import { useAxios } from '~/_lib/axios'

type SurveyContextType = {
  // Activity categories
  activityCategories: string[]
  toggleActivityCategory: (category: string) => void
  clearActivityCategories: () => void
  saveActivityPreferences: () => Promise<boolean>
  
  // Concerns
  concerns: string[]
  toggleConcern: (concern: string) => void
  clearConcerns: () => void
  saveConcerns: () => Promise<boolean>
  
  // Travel types
  travelTypes: string[]
  toggleTravelType: (type: string) => void
  clearTravelTypes: () => void
  saveTravelTypes: () => Promise<boolean>
  
  // Status
  isSaving: boolean
}

const SurveyContext = createContext<SurveyContextType | undefined>(undefined)

const API_PATHS = {
  PREFERENCES: '/v1/survey/preferences',
  CONCERNS: '/v1/survey/concerns',
  TRAVEL_TYPES: '/v1/survey/travel-types'
};

export const SurveyProvider = ({ children }: { children: ReactNode }) => {
  // States for the different survey sections
  const [activityCategories, setActivityCategories] = useState<string[]>([])
  const [concerns, setConcerns] = useState<string[]>([])
  const [travelTypes, setTravelTypes] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)
  
  const axios = useAxios()
  const auth = useAuth()

    useEffect(() => {
      if (!auth.isAuthenticated || auth.isLoading) {
        return;
      }
      const fetchUserPreferences = async () => {
        try {
          // Get activity preferences
          const preferencesResponse = await axios.get(API_PATHS.PREFERENCES)
          if (preferencesResponse.data?.preferences?.length) {
            setActivityCategories(preferencesResponse.data.preferences)
          }
          
          // Get concerns
          const concernsResponse = await axios.get(API_PATHS.CONCERNS)
          if (concernsResponse.data?.concerns?.length) {
            setConcerns(concernsResponse.data.concerns)
          }
          
          // Get travel types
          const travelTypesResponse = await axios.get(API_PATHS.TRAVEL_TYPES)
          if (travelTypesResponse.data?.travel_types?.length) {
            setTravelTypes(travelTypesResponse.data.travel_types)
          }
        } catch (error) {
          console.error('Error loading user preferences:', error)
        }
      }
    
      fetchUserPreferences()
    }, [axios, auth.isAuthenticated, auth.isLoading])

  const toggleActivityCategory = (category: string) => {
    setActivityCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const clearActivityCategories = () => setActivityCategories([])

  const saveActivityPreferences = async (): Promise<boolean> => {
    if (activityCategories.length === 0) return true
    
    setIsSaving(true)

    try {
      console.log('Saving activity preferences to:', API_PATHS.PREFERENCES);
      await axios.post(API_PATHS.PREFERENCES, { preferences: activityCategories })
      return true
    } catch (error) {
      console.error('Failed to save activity preferences:', error)
      return false
    } finally {
      setIsSaving(false)
    }
  }

  // Concerns methods
  const toggleConcern = (concern: string) => {
    setConcerns(prev =>
      prev.includes(concern)
        ? prev.filter(c => c !== concern)
        : [...prev, concern]
    )
  }

  const clearConcerns = () => setConcerns([])

  const saveConcerns = async (): Promise<boolean> => {
    if (concerns.length === 0) return true
    
    setIsSaving(true)
    
    try {
      console.log('Saving concerns to:', API_PATHS.CONCERNS);
      await axios.post(API_PATHS.CONCERNS, { concerns })
      return true
    } catch (error) {
      console.error('Failed to save concerns:', error)
      return false
    } finally {
      setIsSaving(false)
    }
  }

  // Travel type methods
  const toggleTravelType = (type: string) => {
    setTravelTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }

  const clearTravelTypes = () => setTravelTypes([])

  const saveTravelTypes = async (): Promise<boolean> => {
    if (travelTypes.length === 0) return true
    
    setIsSaving(true)
    
    try {
      console.log('Saving travel types to:', API_PATHS.TRAVEL_TYPES);
      await axios.post(API_PATHS.TRAVEL_TYPES, { travel_types: travelTypes })
      return true
    } catch (error) {
      console.error('Failed to save travel types:', error)
      return false
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <SurveyContext.Provider
      value={{
        activityCategories,
        toggleActivityCategory,
        clearActivityCategories,
        saveActivityPreferences,
        
        concerns,
        toggleConcern,
        clearConcerns,
        saveConcerns,
        
        travelTypes,
        toggleTravelType,
        clearTravelTypes,
        saveTravelTypes,
        
        isSaving
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