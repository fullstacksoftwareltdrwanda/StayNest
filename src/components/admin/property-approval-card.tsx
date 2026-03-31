'use client'

import { approveProperty, rejectProperty } from '@/lib/admin/adminActions'
import { StatusBadge } from '@/components/shared/status-badge'
import { Button } from '@/components/ui/Button'
import { Home, User, MapPin, ExternalLink, Check, X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { toast } from 'sonner'

interface PropertyApprovalCardProps {
  property: any
  onActionComplete: () => void
}

export function PropertyApprovalCard({ property, onActionComplete }: PropertyApprovalCardProps) {
  const [loading, setLoading] = useState(false)

  const handleApprove = async () => {
    setLoading(true)
    try {
      await approveProperty(property.id)
      toast.success('Property approved')
      onActionComplete()
    } catch (error: any) {
      toast.error(error.message || 'Failed to approve')
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async () => {
    const reason = window.prompt('Please provide a reason for rejection (optional):')
    if (reason === null) return // Cancelled prompt

    setLoading(true)
    try {
      await rejectProperty(property.id, reason)
      toast.success('Property rejected')
      onActionComplete()
    } catch (error: any) {
      toast.error(error.message || 'Failed to reject')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 flex flex-col md:flex-row gap-8 hover:shadow-xl hover:shadow-gray-200/50 transition-all">
      <div className="w-full md:w-48 h-32 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100 relative">
        {property.main_image_url ? (
          <Image 
            src={property.main_image_url} 
            alt={property.name} 
            fill
            sizes="(max-width: 768px) 100vw, 192px"
            className="object-cover" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <Home className="w-10 h-10" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-black text-gray-900 tracking-tight truncate">
              {property.name}
            </h3>
            <p className="text-sm text-gray-500 font-medium flex items-center mt-1">
              <MapPin className="w-3.5 h-3.5 mr-1 text-[var(--primary)]" />
              {property.city}, {property.country}
            </p>
          </div>
          <StatusBadge status={property.status} />
        </div>

        <div className="flex items-center gap-4 mt-6">
          <div className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
            <User className="w-3 h-3 mr-1.5" />
            Owner: {property.owner?.full_name}
          </div>
          <Link 
            href={`/properties/${property.id}`} 
            target="_blank"
            className="text-xs font-bold text-[var(--primary)] flex items-center hover:underline uppercase tracking-widest"
          >
            Preview <ExternalLink className="w-3 h-3 ml-1" />
          </Link>
        </div>
      </div>

      <div className="flex flex-row md:flex-col justify-end gap-3 mt-4 md:mt-0 md:min-w-[160px]">
        {property.status === 'pending' && (
          <>
            <Button 
              onClick={handleApprove}
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700 shadow-green-100 rounded-2xl h-12"
            >
              <Check className="w-4 h-4 mr-2" /> Approve
            </Button>
            <Button 
              variant="outline"
              onClick={handleReject}
              disabled={loading}
              className="flex-1 border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200 rounded-2xl h-12"
            >
              <X className="w-4 h-4 mr-2" /> Reject
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
