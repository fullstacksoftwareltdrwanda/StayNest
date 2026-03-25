'use client'

import { COMMON_FACILITIES } from '@/types/room'
import { Check } from 'lucide-react'

interface RoomFacilitiesSelectorProps {
  selectedFacilities: string[]
  onChange: (facilities: string[]) => void
}

export function RoomFacilitiesSelector({ selectedFacilities, onChange }: RoomFacilitiesSelectorProps) {
  const toggleFacility = (facility: string) => {
    if (selectedFacilities.includes(facility)) {
      onChange(selectedFacilities.filter((f) => f !== facility))
    } else {
      onChange([...selectedFacilities, facility])
    }
  }

  return (
    <div className="space-y-4">
      <label className="text-sm font-semibold text-gray-700">Room Facilities</label>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {COMMON_FACILITIES.map((facility) => {
          const isSelected = selectedFacilities.includes(facility)
          return (
            <button
              key={facility}
              type="button"
              onClick={() => toggleFacility(facility)}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium border transition-all duration-200 ${
                isSelected
                  ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              <span>{facility}</span>
              {isSelected && <Check className="w-3 h-3 ml-1" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}
