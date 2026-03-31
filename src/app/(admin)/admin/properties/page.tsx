'use client'

import { getPlatformProperties } from '@/lib/admin/adminActions'
import { PropertyApprovalCard } from '@/components/admin/property-approval-card'
import { PageHeader } from '@/components/shared/page-header'
import { useEffect, useState } from 'react'
import { Loader2, Search, Filter, ShieldCheck, Sparkles } from 'lucide-react'
import { Card } from '@/components/shared/Card'

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
    <div className="min-h-screen bg-[var(--background)] pb-24 sm:pb-32 animate-fade-in pt-12 sm:pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ─── Page Header ────────────────────── */}
        <div className="mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-rose-50 text-rose-600 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-rose-100 shadow-sm mb-6 animate-pulse-glow">
            <ShieldCheck className="w-4 h-4" />
            Inventory Protocol
          </div>
          <PageHeader
            title="Catalog Review"
            subtitle="Analyze and validate property listings for platform-wide distribution."
          />
        </div>

        {/* ─── Control Bar: Status Filter ─────── */}
        <div className="mb-12 flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="p-1.5 bg-white/50 backdrop-blur-md rounded-[1.75rem] border border-white/60 shadow-xl shadow-black/[0.02] flex items-center flex-wrap gap-1">
            {['all', 'pending', 'approved', 'rejected', 'draft'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-6 py-3 rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                  filter === status 
                    ? 'bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20' 
                    : 'text-gray-400 hover:text-gray-600 hover:bg-white'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 px-6 py-3 bg-white/50 backdrop-blur-sm border border-white rounded-2xl text-[10px] font-black text-gray-400 uppercase tracking-widest shadow-sm">
            <Filter className="w-4 h-4 opacity-40" />
            Displaying: {properties.length} Results
          </div>
        </div>

        {/* ─── Listings Monitor ───────────────── */}
        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center space-y-6">
            <div className="w-20 h-20 rounded-full border-4 border-[var(--primary)]/10 border-t-[var(--primary)] animate-spin shadow-2xl shadow-[var(--primary)]/20" />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] animate-pulse">Scanning global coordinates...</p>
          </div>
        ) : properties.length === 0 ? (
          <Card padding="xl" className="rounded-[3rem] border-white/60 bg-white shadow-2xl shadow-black/[0.03] text-center max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-[var(--warm-gray)]/30 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 text-gray-300">
              <Search className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-2">Queue is cleared</h3>
            <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs">No properties match the current security filter: <span className="text-[var(--primary)] italic">{filter}</span></p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-8 animate-slide-up">
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
