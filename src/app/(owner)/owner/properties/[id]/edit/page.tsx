import { requireRole } from '@/lib/auth/requireRole'
import { getPropertyById } from '@/lib/properties/getPropertyById'
import { PropertyForm } from '@/components/properties/PropertyForm'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { profile } = await requireRole(['owner', 'admin'])
  const property = await getPropertyById(id)

  if (!property) {
    notFound()
  }

  // Security check: Only the owner or admin can edit
  if (property.owner_id !== profile.id && profile.role !== 'admin') {
    redirect('/unauthorized')
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link href={`/owner/properties/${property.id}`} className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Cancel and Go Back
      </Link>

      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Edit "{property.name}"</h1>
        <p className="text-gray-500 mt-2">Update your listing details below.</p>
      </div>
      <PropertyForm property={property} />
    </div>
  )
}
