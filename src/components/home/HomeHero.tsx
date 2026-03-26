'use client'

import { Star, Shield, Headphones } from 'lucide-react'
import { HeroSearchBar } from './HeroSearchBar'
import { useSettings } from '@/context/SettingsContext'

interface HomeHeroProps {
  stats: {
    reviewCount: number
    hostCount: number
    propertyCount: number
  }
}

export function HomeHero({ stats }: HomeHeroProps) {
  const { t } = useSettings()

  return (
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-dark)] via-[var(--primary)] to-[var(--primary-light)]" />
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1600&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-20 sm:mt-24">
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight mb-4 sm:mb-8 leading-[1.05] animate-fade-in-up">
          {t('home.hero_title')}{' '}
          <span className="text-[var(--accent-light)]">{t('home.hero_stay')}</span>
        </h1>
        <p className="text-base sm:text-xl text-white/75 mb-10 sm:mb-16 leading-relaxed max-w-2xl mx-auto font-medium animate-fade-in px-4" style={{ animationDelay: '0.1s' }}>
          {t('home.hero_subtitle')}
        </p>

        {/* Search Bar Container - More space on mobile */}
        <div className="animate-fade-in-up px-2 sm:px-0" style={{ animationDelay: '0.2s' }}>
          <HeroSearchBar />
        </div>
      </div>

      {/* Trust badges - More compact on mobile */}
      <div className="relative z-10 mt-12 sm:mt-20 mb-8 flex flex-wrap justify-center gap-6 sm:gap-14 animate-fade-in px-4" style={{ animationDelay: '0.4s' }}>
        {[
          { 
            icon: Star, 
            label: t('home.trust.reviews', { count: stats.reviewCount > 1000 ? `${(stats.reviewCount / 1000).toFixed(1)}k` : String(stats.reviewCount) }) 
          },
          { 
            icon: Shield, 
            label: t('home.trust.hosts', { count: String(stats.hostCount) }) 
          },
          { 
            icon: Headphones, 
            label: t('home.trust.support') 
          },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2 text-white/60">
            <Icon className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
