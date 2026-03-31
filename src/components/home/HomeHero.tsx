'use client'

import { Star, Shield, Headphones } from 'lucide-react'
import Image from 'next/image'
import { HeroSearchBar } from './HeroSearchBar'
import { useSettings } from '@/context/SettingsContext'
import { ImigongoPattern } from '@/components/shared/imigongo-pattern'

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
    <section className="relative min-h-[85vh] sm:min-h-[90vh] flex flex-col items-center justify-center overflow-hidden">
      {/* ─── Background ────────────────────────── */}
      <div className="absolute inset-0 bg-[var(--primary-dark)]" />
      
      {/* Imigongo Pattern overlay — Rwandan heritage texture */}
      <div className="absolute inset-0 z-[1]">
        <ImigongoPattern variant="dark" opacity={0.07} className="absolute inset-0 w-full h-full" />
      </div>

      {/* Animated Gradient Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[var(--primary)]/20 rounded-full blur-[120px] animate-pulse z-[2]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[var(--accent)]/10 rounded-full blur-[120px] animate-pulse z-[2]" style={{ animationDelay: '1s' }} />

      {/* Hero Image with Overlay */}
      <div className="absolute inset-0 z-[2]">
        <Image
          src="https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1600&q=80"
          alt="Luxury Stay"
          fill
          priority
          className="object-cover opacity-20 mix-blend-luminosity scale-105 animate-[float_20s_infinite_ease-in-out]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--primary-dark)]/80 via-[var(--primary-dark)]/40 to-[var(--primary-dark)]/90" />
      </div>

      {/* ─── Content ───────────────────────────── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20 sm:pt-32">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">
            {t('home.hero_tag') || 'Discover Rwanda like never before'}
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black text-white tracking-tighter mb-8 leading-[0.95] animate-slide-up text-balance">
          {t('home.hero_title')}{' '}
          <span className="text-gradient animate-gold-shimmer block sm:inline italic">
            {t('home.hero_stay')}
          </span>
        </h1>

        <p
          className="text-base sm:text-xl lg:text-2xl text-white/60 mb-12 lg:mb-16 leading-relaxed max-w-2xl mx-auto font-medium animate-fade-in-up text-balance"
          style={{ animationDelay: '0.2s' }}
        >
          {t('home.hero_subtitle')}
        </p>

        {/* Search Bar Container */}
        <div className="w-full max-w-5xl mx-auto animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <HeroSearchBar />
        </div>

        {/* ─── Trust Badges ──────────────────────── */}
        <div 
          className="mt-16 sm:mt-24 flex flex-wrap justify-center gap-8 sm:gap-16 lg:gap-20 animate-fade-in"
          style={{ animationDelay: '0.8s' }}
        >
          {[
            { 
              icon: Star, 
              label: t('home.trust.reviews', { count: stats.reviewCount > 1000 ? `${(stats.reviewCount / 1000).toFixed(1)}k` : String(stats.reviewCount) }),
              sub: 'Verified Ratings'
            },
            { 
              icon: Shield, 
              label: t('home.trust.hosts', { count: String(stats.hostCount) }),
              sub: 'Expert Hosts'
            },
            { 
              icon: Headphones, 
              label: t('home.trust.support'),
              sub: '24/7 Response'
            },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="group flex flex-col items-center gap-2">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-white/10 transition-all duration-300">
                <Icon className="w-5 h-5 text-[var(--accent)]" />
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs font-black text-white uppercase tracking-widest">{label}</span>
                <span className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] mt-1">{sub}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
