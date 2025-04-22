'use client'

import React from 'react'
import { CalendarClock, MapPin } from 'lucide-react'
import Dropdown from '../../../../_components/dropdown'

interface PreviousActivitySelectorProps {
  selected: string[]
  onSelect: (selected: string[]) => void
  options: string[]
  defaultText: string
  activityDate?: string
  activityLocation?: string
}

const PreviousActivitySelector: React.FC<PreviousActivitySelectorProps> = ({
  selected,
  onSelect,
  options,
  defaultText,
  activityDate,
  activityLocation,
}) => {
  return (
    <div className='flex flex-col gap-y-4'>
      <Dropdown
        selected={selected}
        onSelect={onSelect}
        defaultText={defaultText}
        options={options}
      />
      <span className='flex gap-x-2'>
        <CalendarClock className='text-darkgrey h-6 w-6' />
        {activityDate}
      </span>
      <span className='flex gap-x-2'>
        <MapPin className='text-darkgrey h-6 w-6' />
        {activityLocation}
      </span>
    </div>
  )
}

export default PreviousActivitySelector
