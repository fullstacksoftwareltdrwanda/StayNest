import { requireRole } from '@/lib/auth/requireRole'
import { getOwnerProperties } from '@/lib/properties/getOwnerProperties'
import { PropertyCard } from '@/components/properties/PropertyCard'
import { PropertyEmptyState } from '@/components/properties/PropertyEmptyState'
import { Button } from '@/components/shared/Button'
import Link from 'next/link'
import { Plus, ArrowLeft, Building2 } from 'lucide-react'

export default async function OwnerPropertiesPage() {
  await requireRole(['owner', 'admin'])
  const properties = await getOwnerProperties()

  return (
    <div className="bg-[var(--background)] min-h-screen pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <Link
          href="/owner/dashboard"
          className="inline-flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[var(--primary)] mb-8 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Dashboard
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-[var(--primary)]/5 border border-[var(--primary)]/10 flex items-center justify-center">
                <Building2 className="w-3.5 h-3.5 text-[var(--primary)]" />
              </div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Listings</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tighter">My Properties</h1>
            <p className="text-sm font-medium text-gray-500">
              {properties.length > 0
                ? `${properties.length} listing${properties.length > 1 ? 's' : ''}`
                : 'No listings yet — add your first property below.'}
            </p>
          </div>

          {properties.length > 0 && (
            <Link href="/owner/properties/new">
              <Button
                size="md"
                className="h-11 px-6 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-[var(--primary)]/10"
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Add Property
              </Button>
            </Link>
          )}
        </div>

        {properties.length === 0 ? (
          <PropertyEmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property: any) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
