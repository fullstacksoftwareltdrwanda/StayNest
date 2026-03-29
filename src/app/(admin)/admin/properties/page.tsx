'use client'

import { getPlatformProperties } from '@/lib/admin/adminActions'
import { PropertyApprovalCard } from '@/components/admin/property-approval-card'
import { PageHeader } from '@/components/shared/page-header'
import { useEffect, useState } from 'react'
import { Loader2, Search } from 'lucide-react'

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending')

  const fetchProperties = async () => {
    setLoading(true)
    try {
      const data = await getPlatformProperties(filter)
      setProperties(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties()
  }, [filter])

  return (
    <div className="bg-[var(--warm-white)] min-h-screen pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader
          title="Property Management"
          subtitle="Review, approve, or reject property listings."
        />

        <div className="flex items-center gap-2 mt-10 mb-8 p-1.5 bg-gray-100/50 rounded-2xl w-fit border border-gray-200/50">
          {['all', 'pending', 'approved', 'rejected', 'draft'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                filter === status 
                  ? 'bg-white text-[var(--primary)] shadow-sm' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-[var(--primary)]" />
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-gray-100">
            <div className="w-20 h-20 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 text-gray-300">
              <Search className="w-10 h-10" />
            </div>
            <p className="text-gray-400 font-bold uppercase tracking-[0.2em]">No properties found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {properties.map((property) => (
              <PropertyApprovalCard 
                key={property.id} 
                property={property} 
                onActionComplete={fetchProperties}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
