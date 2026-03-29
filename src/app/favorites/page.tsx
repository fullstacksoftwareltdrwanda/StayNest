'use client'

import { getUserFavorites } from '@/lib/favorites/favoriteActions'
import { PropertyResultCard } from '@/components/search/PropertyResultCard'
import { PageHeader } from '@/components/shared/page-header'
import { EmptyState } from '@/components/shared/empty-state'
import { useEffect, useState } from 'react'
import { PropertySearchResult } from '@/types/search'
import { useSettings } from '@/context/SettingsContext'

export default function FavoritesPage() {
  const { t } = useSettings()
  const [favorites, setFavorites] = useState<PropertySearchResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFavorites() {
      try {
        const data = await getUserFavorites()
        setFavorites(data)
      } catch (error) {
        console.error('Error fetching favorites:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchFavorites()
  }, [])

  if (loading) return <div className="min-h-screen pt-8 text-center font-bold">Loading...</div>

  return (
    <div className="bg-[var(--warm-white)] min-h-screen pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader
          title={t('favorites.title')}
          subtitle={t('favorites.subtitle')}
        />

        {favorites.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[var(--warm-gray-dark)]/50 shadow-sm mt-8">
            <EmptyState
              variant="search"
              title={t('favorites.empty_title')}
              description={t('favorites.empty_description')}
              actionLabel={t('favorites.explore')}
              actionHref="/search"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {favorites.map((property) => (
              <PropertyResultCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
