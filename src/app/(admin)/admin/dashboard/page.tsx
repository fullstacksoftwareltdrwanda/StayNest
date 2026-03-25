import { requireRole } from '@/lib/auth/requireRole'
import { Button } from '@/components/ui/Button'

export default async function AdminDashboard() {
  const { profile } = await requireRole(['admin'])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Admin Console</h1>
        <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 uppercase tracking-wider">
          {profile.role}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Total Users', value: '1,248' },
          { label: 'Total Listings', value: '452' },
          { label: 'Ongoing Bookings', value: '86' },
          { label: 'Reports', value: '12' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="text-gray-500 text-sm font-medium">{stat.label}</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Pending Verifications</h3>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-500 italic">
              No pending verifications.
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">System Alerts</h3>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800">
              System is running smoothly. All services operational.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
