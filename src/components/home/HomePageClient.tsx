'use client'

import { CategoryScroller } from '@/components/home/CategoryScroller'
import { HomepagePropertyCard } from '@/components/home/HomepagePropertyCard'
import { SectionHeader } from '@/components/home/SectionHeader'
import { CTASection } from '@/components/home/CTASection'
import { HomeFooter } from '@/components/home/HomeFooter'
import { EmptyState } from '@/components/shared/empty-state'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { PropertySearchResult } from '@/types/search'
import { useSettings } from '@/context/SettingsContext'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { HomeHero } from '@/components/home/HomeHero'

interface HomePageClientProps {
  initialProperties: PropertySearchResult[]
  stats: {
    reviewCount: number
    hostCount: number
    propertyCount: number
  }
}

export function HomePageClient({ initialProperties, stats }: HomePageClientProps) {
  const { t } = useSettings()
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    checkUser()
  }, [supabase])

  // Separate first 4 as "featured" and the rest as regular
  const featured = initialProperties.slice(0, 4)
  const regular = initialProperties.slice(4)

  return (
    <div className="flex flex-col min-h-screen bg-[var(--warm-white)]">

      {/* ─── Hero ─────────────────────────────── */}
      <HomeHero stats={stats} />

      {/* ─── Categories ───────────────────────── */}
      <section className="bg-[var(--warm-white)] py-10 border-b border-[var(--warm-gray)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CategoryScroller />
        </div>
      </section>

      {/* ─── Featured / Popular Properties ─────── */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <SectionHeader
              label={t('home.popular.label')}
              title={t('home.popular.title')}
              subtitle={t('home.popular.subtitle')}
            />
            <Link
              href="/search"
              className="hidden sm:flex items-center gap-1 text-sm font-bold text-[var(--primary)] hover:underline mb-10"
            >
              {t('home.view_all')} <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {initialProperties.length === 0 ? (
            <EmptyState
              title={t('home.no_results')}
              description={t('common.search.no_results_desc')}
            />
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
              {featured.map((property, i) => (
                <HomepagePropertyCard key={property.id} property={property} featured user={user} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── Explore Rwanda Section ─────────────── */}
      {regular.length > 0 && (
        <section className="bg-[var(--warm-gray)] py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 lg:mb-32">
          <SectionHeader
            title={t('home.discover.title')}
            subtitle={t('home.discover.subtitle')}
            label={t('home.discover.label')}
          />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
            {regular.map((property, i) => (
              <HomepagePropertyCard key={property.id} property={property} user={user} index={i} />
            ))}
          </div>
        </div>
        </section>
      )}

      {/* ─── CTA ──────────────────────────────── */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CTASection />
        </div>
      </section>

      {/* ─── Footer ───────────────────────────── */}
      <HomeFooter />
    </div>
  )
}
