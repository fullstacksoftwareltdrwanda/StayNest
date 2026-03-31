import { searchProperties } from '@/lib/search/searchProperties'
import { SearchBar } from '@/components/search/SearchBar'
import { SearchFilters } from '@/components/search/SearchFilters'
import { SearchResultsList } from '@/components/search/SearchResultsList'
import { SearchFilters as SearchFiltersType } from '@/types/search'
import { SlidersHorizontal } from 'lucide-react'

export default async function SearchPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  const params = await searchParams
  
  const filters: SearchFiltersType = {
    destination: params.destination as string,
    type: params.type as string,
    minPrice: params.minPrice ? parseInt(params.minPrice as string) : undefined,
    maxPrice: params.maxPrice ? parseInt(params.maxPrice as string) : undefined,
    capacity: params.capacity ? parseInt(params.capacity as string) : (params.guests ? parseInt(params.guests as string) : undefined),
    checkIn: params.checkIn as string,
    checkOut: params.checkOut as string,
    guests: params.guests ? parseInt(params.guests as string) : undefined,
  }

  const results = await searchProperties(filters)
  const hasActiveFilters = Object.values(filters).some(v => v !== undefined && v !== '')

  return (
    <div className="min-h-screen bg-[var(--background)] pb-24 sm:pb-32">
      {/* ─── Sticky Search Header ───────────────── */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-[var(--warm-gray)] py-6 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SearchBar />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-16">
          
          {/* ─── Filters Sidebar ────────────────────── */}
          <aside className="lg:col-span-1">
            <div className="sticky top-40 space-y-6">
              <div className="flex items-center gap-3 mb-6 px-1">
                <div className="w-8 h-8 rounded-xl bg-[var(--primary)]/5 flex items-center justify-center text-[var(--primary)]">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em]">Filters</span>
              </div>
              <SearchFilters />
            </div>
          </aside>

          {/* ─── Results Main ───────────────────────── */}
          <main className="lg:col-span-3">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10 pb-8 border-b border-[var(--warm-gray)]">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight text-balance">
                  {results.length} {results.length === 1 ? 'property' : 'properties'} found
                </h2>
                {filters.destination ? (
                  <p className="text-gray-500 font-medium mt-2">
                    Showing results for <span className="text-[var(--primary)] font-black italic underline underline-offset-4 decoration-[var(--accent)]/30">"{filters.destination}"</span>
                  </p>
                ) : (
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-3">Curated Stays</p>
                )}
              </div>

              {hasActiveFilters && results.length === 0 && (
                <div className="bg-amber-50 border border-amber-100 px-6 py-4 rounded-[1.5rem] max-w-sm animate-pulse-glow">
                  <p className="text-xs text-amber-800 font-bold leading-relaxed">
                    No results matched your filters. Try adjusting them or{' '}
                    <a href="/search" className="font-black underline transition-colors hover:text-[var(--primary)]">clear all filters</a>.
                  </p>
                </div>
              )}
            </div>

            {results.length === 0 ? (
              <SearchResultsList results={[]} />
            ) : (
              <SearchResultsList results={results as any} />
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
