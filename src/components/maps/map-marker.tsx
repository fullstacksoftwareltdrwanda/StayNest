'use client'

import React from 'react'
import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { useSettings } from '@/context/SettingsContext'

// Custom StayNest Marker Icon (Gold Circle with White Border)
const stayNestIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `
    <div style="background-color: var(--primary); width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); display: flex; items: center; justify: center;">
      <div style="background-color: white; width: 6px; height: 6px; border-radius: 50%;"></div>
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
})

interface MapMarkerProps {
    position: [number, number]
    title?: string
    price?: number
    className?: string
}

export default function MapMarker({ position, title, price, className }: MapMarkerProps) {
    const { formatPrice } = useSettings()

    return (
        <Marker position={position} icon={stayNestIcon}>
            {title && (
                <Popup className="staynest-popup">
                    <div className="p-2 space-y-1">
                        <h4 className="text-sm font-bold text-gray-900 tracking-tight leading-shug">{title}</h4>
                        {price && (
                            <div className="text-[11px] font-bold text-[var(--primary)] uppercase tracking-widest">
                                {formatPrice(price)} {localStorage.getItem('currency') || 'USD'}
                            </div>
                        )}
                    </div>
                </Popup>
            )}
        </Marker>
    )
}
