import { Property } from '@/types/property'
import { Info, ShieldCheck, Map } from 'lucide-react'

interface PropertyOverviewProps {
  property: Property
}

export function PropertyOverview({ property }: PropertyOverviewProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div className="lg:col-span-2 space-y-10">
        <div className="bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-sm leading-relaxed">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-blue-50 rounded-2xl">
              <Info className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">About this property</h2>
          </div>
          <div className="text-gray-600 text-lg whitespace-pre-wrap leading-loose">
            {property.description}
          </div>
        </div>

        <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-3 bg-green-50 rounded-2xl">
              <ShieldCheck className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">StayNest Guarantee</h2>
          </div>
          <p className="text-gray-500 max-w-xl text-lg leading-relaxed">
            Every booking through StayNest is backed by our full support and price-match guarantee. We ensure your host is verified and ready to welcome you.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm h-full">
           <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-orange-50 rounded-2xl">
              <Map className="w-6 h-6 text-orange-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Neighborhood</h2>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            Located in the vibrant heart of {property.city}, this {property.type.toLowerCase()} offers easy access to local attractions and authentic culinary experiences.
          </p>
          <div className="h-48 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 italic text-xs">
            Map integration coming soon...
          </div>
        </div>
      </div>
    </div>
  )
}
