'use client'

import { useState } from 'react'
import { PropertySearchResult } from '@/types/search'
import { PropertyResultCard } from './PropertyResultCard'
import { EmptyState } from '@/components/shared/empty-state'
import { Map, LayoutGrid, MapPin } from 'lucide-react'
import dynamic from 'next/dynamic'
import { MAP_CONFIG } from '@/lib/maps/map-config'

// Dynamic imports for Leaflet (client-side only)
const MapView = dynamic(() => import('@/components/maps/map-view'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-gray-50 animate-pulse rounded-[2rem] flex items-center justify-center">
      <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">Loading Results Map...</span>
    </div>
  )
})

const MapMarker = dynamic(() => import('@/components/maps/map-marker'), { ssr: false })

interface SearchResultsListProps {
  results: (PropertySearchResult & { latitude?: number | null; longitude?: number | null })[]
}

export function SearchResultsList({ results }: SearchResultsListProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid')

  if (results.length === 0) {
    return (
      <div className="animate-fade-in-up">
        <EmptyState
          variant="search"
          actionLabel="Clear all filters"
          actionHref="/search"
          className="bg-white rounded-[2.5rem] border border-[var(--warm-gray)] shadow-sm"
        />
      </div>
    )
  }

  // Filter properties that have coordinates for the map
  const mapResults = results.filter(p => p.latitude && p.longitude)
  const defaultCenter = mapResults.length > 0 
    ? [Number(mapResults[0].latitude), Number(mapResults[0].longitude)] as [number, number]
    : MAP_CONFIG.DEFAULT_CENTER

  return (
    <div className="space-y-8">
      {/* View Toggle */}
      <div className="flex justify-end">
        <div className="inline-flex p-1 bg-gray-100 rounded-full border border-gray-200 shadow-sm">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-2 px-6 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
              viewMode === 'grid' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            Grid View
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-2 px-6 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
              viewMode === 'map' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            Map View
          </button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-10 animate-fade-in">
          {results.map((property, i) => (
            <PropertyResultCard key={property.id} property={property} index={i} />
          ))}
        </div>
      ) : (
        <div className="animate-fade-in overflow-hidden rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-black/[0.04]">
            <div className="h-[600px] w-full relative">
                <MapView center={defaultCenter} zoom={11}>
                    {mapResults.map((property) => (
                        <MapMarker 
                            key={property.id}
                            position={[Number(property.latitude), Number(property.longitude)]}
                            title={property.name}
                            // Assuming price can be derived from rooms or is part of property in search results
                            // In this case, search results usually have room price info flattened or as a separate field
                        />
                    ))}
                </MapView>

                {/* Legend/Note if some items are missing coords */}
                {results.length > mapResults.length && (
                    <div className="absolute bottom-6 left-6 z-[1000]">
                        <div className="bg-amber-50/90 backdrop-blur-md border border-amber-100 px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                            <MapPin className="w-3.5 h-3.5 text-amber-600" />
                            <span className="text-[10px] font-bold text-amber-800 tracking-tight">
                                {results.length - mapResults.length} properties missing exact coordinates
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  )
}
