'use client'

import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { MAP_CONFIG, MAP_CONTAINER_STYLE } from '@/lib/maps/map-config'
import L from 'leaflet'

// Fix for default marker icons in Leaflet with Next.js
const fixLeafletMarkers = () => {
    // @ts-ignore
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
};

interface MapViewProps {
  center?: [number, number]
  zoom?: number
  children?: React.ReactNode
  className?: string
}

// Helper to update map center when props change
function MapCenterController({ center }: { center: [number, number] }) {
  const map = useMap()
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom())
    }
  }, [center, map])
  return null
}

export default function MapView({
  center = MAP_CONFIG.DEFAULT_CENTER,
  zoom = MAP_CONFIG.DEFAULT_ZOOM,
  children,
  className,
}: MapViewProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    fixLeafletMarkers()
  }, [])

  if (!isMounted) {
    return (
      <div 
        className={`w-full h-full bg-gray-100 animate-pulse rounded-[1.5rem] flex items-center justify-center ${className}`}
        style={{ minHeight: '400px' }}
      >
        <span className="text-gray-400 font-bold text-sm uppercase tracking-widest">Loading Map...</span>
      </div>
    )
  }

  return (
    <div className={`w-full h-full relative ${className}`} style={{ minHeight: '400px' }}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        style={MAP_CONTAINER_STYLE}
      >
        <TileLayer
          attribution={MAP_CONFIG.ATTRIBUTION}
          url={MAP_CONFIG.TILE_LAYER}
        />
        <MapCenterController center={center} />
        {children}
      </MapContainer>
    </div>
  )
}
