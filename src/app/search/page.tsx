import { searchProperties } from '@/lib/search/searchProperties'
import { SearchBar } from '@/components/search/SearchBar'
import { SearchFilters } from '@/components/search/SearchFilters'
import { PropertyResultCard } from '@/components/search/PropertyResultCard'
import { SearchEmptyState } from '@/components/search/SearchEmptyState'
import { SearchFilters as SearchFiltersType } from '@/types/search'

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
    capacity: params.capacity ? parseInt(params.capacity as string) : undefined,
  }

  const results = await searchProperties(filters)

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Top Search Header */}
      <div className="bg-white border-b border-gray-100 pt-8 pb-12 shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SearchBar />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <SearchFilters />
          </aside>

          {/* Results Grid */}
          <main className="lg:col-span-3">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                  {results.length} {results.length === 1 ? 'property' : 'properties'} found
                </h2>
                {filters.destination ? (
                  <p className="text-gray-500 text-sm mt-1">
                    Showing results in <span className="text-blue-600 font-bold">"{filters.destination}"</span>
                  </p>
                ) : (
                  <p className="text-gray-400 text-xs mt-1 uppercase tracking-widest font-bold">
                    Showing all approved properties
                  </p>
                )}
              </div>
              
              {results.length === 0 && (
                <div className="hidden md:block bg-blue-50 border border-blue-100 p-4 rounded-2xl max-w-xs">
                  <p className="text-[10px] text-blue-600 leading-relaxed">
                    <span className="font-bold block mb-1">OWNER TIP:</span>
                    Only properties with <span className="font-bold uppercase">Approved</span> status and at least one room are visible here. Check your dashboard to manage your listings.
                  </p>
                </div>
              )}
            </div>

            {results.length === 0 ? (
              <SearchEmptyState />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
