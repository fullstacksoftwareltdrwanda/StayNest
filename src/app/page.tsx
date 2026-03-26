import { getFeaturedProperties } from '@/lib/properties/getFeaturedProperties'
import { HeroSearchBar } from '@/components/home/HeroSearchBar'
import { CategoryScroller } from '@/components/home/CategoryScroller'
import { HomepagePropertyCard } from '@/components/home/HomepagePropertyCard'
import { SectionHeader } from '@/components/home/SectionHeader'
import { CTASection } from '@/components/home/CTASection'
import { HomeFooter } from '@/components/home/HomeFooter'
import { EmptyState } from '@/components/shared/empty-state'
import Link from 'next/link'
import { ChevronRight, Star, Shield, Headphones } from 'lucide-react'

export default async function HomePage() {
  const properties = await getFeaturedProperties(12)

  // Separate first 4 as "featured" and the rest as regular
  const featured = properties.slice(0, 4)
  const regular = properties.slice(4)

  return (
    <div className="flex flex-col min-h-screen bg-[var(--warm-white)]">

      {/* ─── Hero ─────────────────────────────── */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-dark)] via-[var(--primary)] to-[var(--primary-light)]" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1600&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto mt-16">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight mb-6 leading-[1.05] animate-fade-in-up">
            Find your perfect{' '}
            <span className="text-[var(--accent-light)]">stay anywhere</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/75 mb-14 leading-relaxed max-w-xl mx-auto font-medium animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Discover comfortable, affordable, and premium places to stay — from cozy apartments to luxury villas.
          </p>

          {/* Search Bar */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <HeroSearchBar />
          </div>
        </div>

        {/* Trust badges */}
        <div className="relative z-10 mt-16 mb-8 flex flex-wrap justify-center gap-8 sm:gap-14 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          {[
            { icon: Star, label: '10k+ Reviews' },
            { icon: Shield, label: 'Verified Hosts' },
            { icon: Headphones, label: '24/7 Support' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-white/60">
              <Icon className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
            </div>
          ))}
        </div>
      </section>

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
              label="Popular"
              title="Guests' Top Picks"
              subtitle="Properties loved by travellers, sorted by ratings and reviews."
            />
            <Link
              href="/search"
              className="hidden sm:flex items-center gap-1 text-sm font-bold text-[var(--primary)] hover:underline mb-10"
            >
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {properties.length === 0 ? (
            <EmptyState
              variant="properties"
              description="No approved properties available yet. Check back soon!"
              actionLabel="Explore"
              actionHref="/search"
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map((property) => (
                <HomepagePropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── Explore Rwanda Section ─────────────── */}
      {regular.length > 0 && (
        <section className="bg-[var(--warm-gray)] py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              label="Discover"
              title="Explore Rwanda's Best Stays"
              subtitle="Curated properties for an unforgettable experience in the land of a thousand hills."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {regular.slice(0, 6).map((property) => (
                <HomepagePropertyCard key={property.id} property={property} featured />
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
