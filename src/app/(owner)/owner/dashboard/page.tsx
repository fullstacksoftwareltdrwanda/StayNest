import { requireRole } from '@/lib/auth/requireRole'
import { getOwnerProperties } from '@/lib/properties/getOwnerProperties'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { Plus, Home, MapPin } from 'lucide-react'

export default async function OwnerDashboard() {
  const { profile } = await requireRole(['owner', 'admin'])
  const properties = await getOwnerProperties()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-blue-100">
            {profile.full_name.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{profile.full_name}</h1>
            <div className="flex items-center mt-1 space-x-2">
              <span className="text-gray-500 text-sm">{profile.email}</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 uppercase tracking-widest border border-blue-200">
                {profile.role}
              </span>
            </div>
          </div>
        </div>
        <Link href="/owner/properties/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add New Property
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
          <div className="text-4xl font-bold text-gray-900">{properties.length}</div>
          <div className="text-xs font-bold text-gray-400 mt-2 uppercase tracking-widest">Total Properties</div>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
          <div className="text-4xl font-bold text-green-600">
            {properties.filter(p => p.status === 'approved').length}
          </div>
          <div className="text-xs font-bold text-gray-400 mt-2 uppercase tracking-widest">Visible in Search</div>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
          <div className="text-4xl font-bold text-orange-500">
            {properties.filter(p => p.status === 'pending').length}
          </div>
          <div className="text-xs font-bold text-gray-400 mt-2 uppercase tracking-widest">Pending Review</div>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
          <div className="text-4xl font-bold text-gray-900">$0.00</div>
          <div className="text-xs font-bold text-gray-400 mt-2 uppercase tracking-widest">Earned Today</div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">Recent Listings</h3>
          <Link href="/owner/properties" className="text-sm font-medium text-blue-600 hover:text-blue-700">View All</Link>
        </div>
        
        {properties.length === 0 ? (
          <div className="p-16 text-center text-gray-400 italic">
            You haven't added any properties yet.
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {properties.slice(0, 5).map((property) => (
              <div key={property.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 overflow-hidden relative">
                    {property.main_image_url ? (
                      <img src={property.main_image_url} alt={property.name} className="object-cover w-full h-full" />
                    ) : (
                      <Home className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                       <h4 className="font-bold text-gray-900">{property.name}</h4>
                       <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest border ${
                         property.status === 'approved' ? 'bg-green-50 text-green-600 border-green-100' :
                         property.status === 'pending' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' :
                         'bg-gray-50 text-gray-500 border-gray-100'
                       }`}>
                         {property.status}
                       </span>
                    </div>
                    <p className="text-xs text-gray-500 flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {property.city}, {property.country}
                    </p>
                  </div>
                </div>
                <Link href={`/owner/properties/${property.id}`}>
                  <Button variant="ghost" size="sm">Manage</Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-10 bg-blue-50 border border-blue-100 p-8 rounded-[2rem] flex flex-col md:flex-row items-center gap-6">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm flex-shrink-0">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1.053r8.447 8.447 0 01-16.894 0zM12 2v2m0 16v2m10-10h-2M4 10H2m16.364-6.364l-1.414 1.414M7.05 16.95l-1.414 1.414M16.95 16.95l1.414 1.414M7.05 7.05L5.636 5.636" />
          </svg>
        </div>
        <div className="flex-1">
          <h4 className="text-lg font-bold text-blue-900 mb-1 leading-tight">Property Not Visible in Search?</h4>
          <p className="text-blue-700/80 text-sm leading-relaxed">
            Only properties with <span className="font-bold text-blue-800 uppercase tracking-widest text-[10px] px-2 py-0.5 bg-blue-100 rounded-md ml-1">Approved</span> status are visible to guests in the public search. 
            Make sure your property has at least one room and has been reviewed by an administrator.
          </p>
        </div>
        <div className="flex-shrink-0">
          <Link href="/owner/properties">
            <Button variant="outline" className="bg-white border-blue-200 text-blue-700 hover:bg-blue-100 rounded-xl px-6 py-4 font-bold h-auto shadow-sm">
              Manage Status
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
