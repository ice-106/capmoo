'use client'

import React, { useEffect } from 'react'
import Header from '~/_components/header'
import VendorFooter from '~/_components/vendor-footer'
import { useRouter } from 'next/navigation'
// Schedule Data
const scheduleDummy = [
  {
    activity: 'Activity 1',
    startTime: '2025-04-14T10:00:00Z',
    endTime: '2025-04-14T13:00:00Z',
  },
  {
    activity: 'Activity 2',
    startTime: '2025-05-02T12:00:00Z',
    endTime: '2025-05-02T13:00:00Z',
  },
  {
    activity: 'Activity 3',
    startTime: '2025-04-15T12:00:00Z',
    endTime: '2025-04-15T13:00:00Z',
  },
  {
    activity: 'Activity 4',
    startTime: '2025-04-15T08:00:00Z',
    endTime: '2025-04-15T14:00:00Z',
  },
  {
    activity: 'Activity 5',
    startTime: '2025-04-18T08:00:00Z',
    endTime: '2025-04-18T14:00:00Z',
  },
  {
    activity: 'Activity 6',
    startTime: '2025-05-03T03:00:00Z',
    endTime: '2025-05-03T09:00:00Z',
  },
  {
    activity: 'Activity 7',
    startTime: '2025-03-31T16:00:00Z',
    endTime: '2025-03-31T17:00:00Z',
  },
]

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

// Type Definitions
type DateInfo = {
  date: number
  month: number
  year: number
}

type Schedule = {
  activity: string
  startTime: string
  endTime: string
}

type TransformedSchedule = {
  [date: string]: {
    [activity: string]: {
      start: string
      end: string
    }
  }
}

export default function SchedulePage() {
  const router = useRouter()
  const transformedSchedule = transformSchedule(scheduleDummy)
  const { weeks, previousMonthEndIndex, nextMonthStartIndex, currentMonth } =
    getCurrentMonthCalendar(scheduleDummy)

  useEffect(() => {
    // probably fetch data using timeframe from getCurrentMonthCalendar
  }, [])

  const handleFindSchedule = (date: string) => {
    const targetElement = document.getElementById(date)
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' })
    } else {
      return
    }
  }

  return (
    <main className='font-poppins w-full'>
      <Header text='Schedule' />

      {/* Main content */}
      <div className='flex w-full flex-col gap-12'>
        {/* Calendar grid */}
        <div className='flex flex-col gap-2'>
          {/* Month */}
          <h2 className='text-orange w-full rounded-lg bg-black p-2 text-center font-semibold'>
            {monthNames[currentMonth]}
          </h2>

          {/* Day labels */}
          <div className='border-orange bg-pumpkin-lemon text-wh grid grid-cols-7 gap-0 rounded-lg border-2 p-2'>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div
                key={day}
                className='flex items-center justify-center font-semibold'
              >
                {day}
              </div>
            ))}
          </div>

          {/* Days in the month */}
          {weeks.map((week, weekIndex) => (
            <div
              key={weekIndex}
              className='border-orange grid grid-cols-7 gap-0 rounded-lg border-2 p-2'
            >
              {week.map((day, dayIndex) =>
                !day.date ? (
                  // Empty day slots in case of error
                  <div key={dayIndex}></div>
                ) : day.isScheduled ? (
                  // Scheduled days
                  <div
                    key={dayIndex}
                    className='bg-orange flex cursor-pointer items-center justify-center rounded-full font-semibold text-white'
                    onClick={() =>
                      handleFindSchedule(
                        [
                          day.date.toString().padStart(2, '0'),
                          monthNames[day.month],
                        ].join(' ')
                      )
                    }
                  >
                    {day.date}
                  </div>
                ) : (weekIndex === 0 && dayIndex < previousMonthEndIndex) ||
                  (weekIndex === weeks.length - 1 &&
                    dayIndex >= nextMonthStartIndex) ? (
                  // Previous or Next month days
                  <div
                    key={dayIndex}
                    className='text-lightgrey flex items-center justify-center'
                  >
                    {day.date}
                  </div>
                ) : (
                  // Current month days
                  <div
                    key={dayIndex}
                    className='flex items-center justify-center text-black'
                  >
                    {day.date}
                  </div>
                )
              )}
            </div>
          ))}
        </div>

        {/* Schedule details */}
        <div className='flex w-full flex-col gap-4'>
          {Object.keys(transformedSchedule).map((date) => (
            <div key={date} id={date} className='flex flex-col gap-2'>
              <h4>{date}</h4>
              {transformedSchedule[date] &&
                Object.entries(transformedSchedule[date]).map(
                  ([activity, times]) => (
                    <div
                      key={[activity, times.start, times.end].join('-')}
                      className='flex flex-col gap-2 rounded-xl bg-[#F1F1F1] px-4 pb-4 pt-2'
                    >
                      {/* Time + Title + Subtitle */}
                      <div className='flex items-start justify-between gap-4 rounded-xl bg-[#F1F1F1] p-4'>
                        {/* Left: Time */}
                        <div className='text-lg font-bold'>
                          {times.start} - {times.end}
                        </div>

                        {/* Right: Activity details */}
                        <div className='text-right leading-tight'>
                          <p className='text-lg font-bold'>{activity}</p>
                          <p className='text-gray-500'>Coconut Kitchen</p>
                          <p className='text-gray-500'>7/10 participants</p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className='mt-3 flex justify-between gap-2'>
                        <button
                          className='flex-1 rounded-xl border border-gray-400 py-2 font-semibold text-gray-400'
                          onClick={async () => {
                            const confirmDelete = confirm(
                              'Are you sure you want to delete this activity?'
                            )
                            if (!confirmDelete) return

                            try {
                              const res = await fetch(
                                `/api/activity/${activity}`,
                                {
                                  method: 'DELETE',
                                }
                              )

                              if (res.ok) {
                                alert('Activity deleted successfully!')
                                // Optionally refresh or update the UI
                              } else {
                                alert('Failed to delete activity.')
                              }
                            } catch (error) {
                              console.error('Error deleting:', error)
                              alert('An error occurred.')
                            }
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          className='flex-1 rounded-xl bg-[#EB7926] py-2 font-semibold text-white'
                          onClick={() => router.push('/vendor/draft/1')}
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  )
                )}
            </div>
          ))}
        </div>
      </div>
      <VendorFooter />
    </main>
  )
}

// Helper function to format time as HH:mm
function formatTime(dateString: string): string {
  const date = new Date(dateString)
  const hours = String(date.getUTCHours()).padStart(2, '0') // Get hours in 24-hour format and pad
  const minutes = String(date.getUTCMinutes()).padStart(2, '0') // Get minutes and pad
  return `${hours}:${minutes}`
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0') // Get the day and pad it
  const month = monthNames[date.getMonth()] // Get the month name
  const result = `${day} ${month}` // Format the date as "DD Month"

  return result
}

// Helper function for extracting data from the schedule
const transformSchedule = (schedule: Schedule[]): TransformedSchedule => {
  const result: TransformedSchedule = {}

  schedule.forEach(({ activity, startTime, endTime }) => {
    const startDate = startTime
      ? new Date(startTime).toISOString().split('T')[0]
      : undefined
    const endDate = endTime
      ? new Date(endTime).toISOString().split('T')[0]
      : undefined

    if (!startDate || !endDate) return // Skip if any date is invalid

    // For the range from startDate to endDate, populate each day
    const start = new Date(startDate)
    const end = new Date(endDate)
    let currentDate = start

    while (currentDate <= end) {
      const currentDateString = currentDate
        .toISOString()
        .split('T')[0] as string // 'YYYY-MM-DD'

      if (!result[currentDateString]) {
        result[currentDateString] = {}
      }

      // Format start and end times as HH:mm (hour:minute)
      const formattedStart =
        startDate === currentDateString ? formatTime(startTime) : '-'
      const formattedEnd =
        endDate === currentDateString ? formatTime(endTime) : '-'

      // Record to result
      if (formattedStart !== '-' || formattedEnd !== '-') {
        result[currentDateString][activity] = {
          start: formattedStart,
          end: formattedEnd,
        }
      }

      currentDate.setDate(currentDate.getDate() + 1) // Move to the next day
    }
  })

  // Filter out dates that have no activities or only placeholder values
  Object.keys(result).forEach((date) => {
    if (Object.keys(result[date] as {}).length === 0) {
      delete result[date] // Remove empty dates
    }
  })

  // Convert date format from YYYY-MM-DD to DD Month format
  const formattedResult: TransformedSchedule = {}

  // Sort dates in ascending order (nearest to furthest)
  const sortedDates = Object.keys(result).sort((a, b) => {
    const dateA = new Date(a)
    const dateB = new Date(b)
    return dateA.getTime() - dateB.getTime()
  })

  sortedDates.forEach((date) => {
    const formattedDate = formatDate(date) // Convert the date format

    // Ensure the date exists in result, or initialize it as an empty object
    formattedResult[formattedDate] = formattedResult[formattedDate] || {}

    // Sort activities by their start time for each date
    const sortedActivities = Object.keys(result[date] ?? {}).sort((a, b) => {
      const startA = result[date]?.[a]?.start ?? '-'
      const startB = result[date]?.[b]?.start ?? '-'
      const endA = result[date]?.[a]?.end ?? '-'
      const endB = result[date]?.[b]?.end ?? '-'

      // First, prioritize sorting by 'start' time
      if (startA === '-' && startB !== '-') return 1 // '-' should come last
      if (startA !== '-' && startB === '-') return -1 // valid start should come first
      if (startA !== '-' && startB !== '-') {
        // If both have valid start times, compare them
        const startComparison = startA.localeCompare(startB)
        if (startComparison !== 0) return startComparison
      }

      // If start times are equal, compare by 'end' time
      if (endA === '-' && endB !== '-') return 1 // '-' should come last
      if (endA !== '-' && endB === '-') return -1 // valid end should come first
      return endA.localeCompare(endB) // Compare valid end times
    })

    sortedActivities.forEach((activity) => {
      // Ensure result[date][activity] is defined before adding to formattedResult
      if (result[date] && result[date][activity]) {
        if (!formattedResult[formattedDate]) {
          formattedResult[formattedDate] = {} // Initialize if not already present
        }

        formattedResult[formattedDate][activity] = result[date][activity]
      }
    })
  })

  return formattedResult
}

// Utility function to get scheduled dates
const getDatesFromSchedule = (schedule: Schedule[]): DateInfo[] => {
  const dates = new Set<string>()

  schedule.forEach(({ startTime, endTime }) => {
    const start = new Date(startTime)
    const end = new Date(endTime)
    let currentDate = new Date(start)

    while (currentDate <= end) {
      const dateStr = currentDate.toISOString().split('T')[0] // "YYYY-MM-DD"

      if (!dateStr) {
        throw new Error('Invalid date string') // In case of unexpected empty strings
      }

      dates.add(dateStr)
      currentDate.setDate(currentDate.getDate() + 1) // Move to the next day
    }
  })

  return Array.from(dates).map((dateStr) => {
    const [yearStr, monthStr, dateStrNumber] = dateStr.split('-')
    return {
      date: Number(dateStrNumber),
      month: Number(monthStr) - 1, // Adjust for 0-indexed months
      year: Number(yearStr),
    }
  })
}

// Function to get the current month's calendar and schedule data
const getCurrentMonthCalendar = (schedule: Schedule[]) => {
  const scheduleDates = getDatesFromSchedule(schedule)
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()

  // Helper function to get the number of days in a month
  const getDaysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate()

  // Helper function to check if a date is in the schedule
  const isDateInSchedule = (date: number, month: number, year: number) =>
    scheduleDates.some(
      (item) => item.date === date && item.month === month && item.year === year
    )

  // Get the first day and number of days for the current month
  const firstDay = new Date(currentYear, currentMonth, 1).getDay()
  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const previousMonthDays = getDaysInMonth(currentYear, currentMonth - 1)

  // Get next month's start index
  let nextMonthStartIndex = new Date(currentYear, currentMonth + 1, 1).getDay()
  nextMonthStartIndex = nextMonthStartIndex === 0 ? 8 : nextMonthStartIndex

  // Create an array to represent the calendar days
  const days = []
  let previousMonthEndIndex = 0

  // Fill in previous month's days (leading days)
  for (let i = firstDay - 1; i >= 0; i--) {
    const date = previousMonthDays - i
    days.push({
      date,
      month: currentMonth - 1,
      isScheduled: isDateInSchedule(date, currentMonth - 1, currentYear),
    })
    previousMonthEndIndex++
  }

  // Fill in current month's days
  for (let date = 1; date <= daysInMonth; date++) {
    days.push({
      date,
      month: currentMonth,
      isScheduled: isDateInSchedule(date, currentMonth, currentYear),
    })
  }

  // Fill in next month's days (trailing days)
  const daysNeededForNextMonth =
    days.length % 7 === 0 ? 0 : 7 - (days.length % 7)
  for (let date = 1; date <= daysNeededForNextMonth; date++) {
    days.push({
      date,
      month: currentMonth + 1,
      isScheduled: isDateInSchedule(date, currentMonth + 1, currentYear),
    })
  }

  // Group days into weeks (7-day chunks)
  const weeks = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }

  return { weeks, previousMonthEndIndex, nextMonthStartIndex, currentMonth }
}
