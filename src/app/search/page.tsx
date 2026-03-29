import { searchProperties } from '@/lib/search/searchProperties'
import { SearchBar } from '@/components/search/SearchBar'
import { SearchFilters } from '@/components/search/SearchFilters'
import { PropertyResultCard } from '@/components/search/PropertyResultCard'
import { EmptyState } from '@/components/shared/empty-state'
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
    <div className="min-h-screen bg-gray-50/30 pb-20">
      {/* Sticky Search Header */}
      <div className="bg-white/95 backdrop-blur-md border-b border-gray-100 pt-20 pb-6 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SearchBar />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-36">
              <div className="flex items-center gap-2 mb-4">
                <SlidersHorizontal className="w-4 h-4 text-gray-400" />
                <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Filters</span>
              </div>
              <SearchFilters />
            </div>
          </aside>

          {/* Results */}
          <main className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-black text-gray-900 tracking-tight">
                  {results.length} {results.length === 1 ? 'property' : 'properties'} found
                </h2>
                {filters.destination ? (
                  <p className="text-gray-400 text-xs mt-1 font-medium">
                    Results for <span className="text-[var(--primary)] font-bold">"{filters.destination}"</span>
                  </p>
                ) : (
                  <p className="text-gray-400 text-xs mt-1 font-bold uppercase tracking-widest">All approved properties</p>
                )}
              </div>

              {hasActiveFilters && results.length === 0 && (
                <div className="hidden md:block bg-amber-50 border border-amber-100 px-4 py-3 rounded-2xl max-w-xs">
                  <p className="text-xs text-amber-700 font-medium leading-relaxed">
                    No results matched your filters. Try adjusting them or{' '}
                    <a href="/search" className="font-bold underline">clearing all filters</a>.
                  </p>
                </div>
              )}
            </div>

            {results.length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
                <EmptyState
                  variant="search"
                  actionLabel="Clear all filters"
                  actionHref="/search"
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.map((property) => (
                  <PropertyResultCard key={property.id} property={property} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
