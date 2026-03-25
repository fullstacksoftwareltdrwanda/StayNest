import { requireRole } from '@/lib/auth/requireRole'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default async function GuestDashboard() {
  const { profile } = await requireRole(['guest', 'owner', 'admin'])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex items-center space-x-5">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-2xl shadow-blue-200">
            {profile.full_name.charAt(0)}
          </div>
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
              Welcome back, {profile.full_name.split(' ')[0]}!
            </h1>
            <div className="flex items-center space-x-3">
              <span className="text-gray-500 font-medium">{profile.email}</span>
              <span className="w-1.5 h-1.5 bg-gray-200 rounded-full"></span>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                profile.role === 'owner' 
                  ? 'bg-blue-50 text-blue-700 border-blue-100' 
                  : 'bg-green-50 text-green-700 border-green-100'
              }`}>
                {profile.role === 'owner' ? 'Active Host Account' : 'Active Guest Account'}
              </span>
            </div>
          </div>
        </div>
        
        {profile.role === 'owner' && (
          <Link href="/owner/dashboard">
            <Button size="lg" className="rounded-2xl px-8 py-6 font-black text-lg shadow-xl shadow-blue-100 hover:scale-105 transition-all">
              Switch to Hosting
            </Button>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">My Bookings</h3>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">Manage your upcoming trips and travel history.</p>
              <Link href="/bookings">
                <Button variant="outline" className="w-full rounded-xl py-5 font-bold">View History</Button>
              </Link>
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Saved Places</h3>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">Quickly access the properties you've liked most.</p>
              <Button variant="outline" className="w-full rounded-xl py-5 font-bold" disabled>Coming Soon</Button>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[2rem] border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Account Verification</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="font-bold text-gray-700">Email Verified</span>
                </div>
                <span className="text-xs text-gray-400 font-medium tracking-tight">COMPLETED</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl opacity-60">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <span className="font-bold text-gray-400">Identity Verification</span>
                </div>
                <span className="text-xs text-blue-600 font-bold uppercase tracking-widest cursor-pointer hover:underline">Start Now</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {profile.role === 'owner' ? (
            <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl relative overflow-hidden group h-full">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl transition-transform group-hover:scale-110" />
              <div className="relative z-10 flex flex-col justify-between h-full min-h-[300px]">
                <div>
                  <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                    Professional Host
                  </div>
                  <h3 className="text-3xl font-black mb-4 leading-tight text-gray-900">Manage your business</h3>
                  <p className="text-gray-500 text-lg leading-relaxed mb-10">
                    Add new properties, manage rooms, and track your bookings in one place.
                  </p>
                </div>
                <Link href="/owner/properties">
                  <Button size="lg" className="w-full bg-blue-600 text-white hover:bg-blue-700 font-black rounded-2xl py-8 text-xl shadow-xl shadow-blue-200 transition-all hover:-translate-y-1">
                    Manage Properties
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-10 rounded-[2.5rem] text-white shadow-2xl shadow-blue-200 relative overflow-hidden group">
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-48 h-48 bg-white/10 rounded-full blur-3xl transition-transform group-hover:scale-110" />
              
              <div className="relative z-10 h-full flex flex-col justify-between min-h-[300px]">
                <div>
                  <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                    Host Opportunity
                  </div>
                  <h3 className="text-3xl font-black mb-4 leading-tight">Ready to host your space?</h3>
                  <p className="text-blue-100 text-lg leading-relaxed mb-10">
                    Switch to host mode and start earning from your property. It's fast, free, and secure.
                  </p>
                </div>
                <form action="/api/auth/become-host" method="POST">
                  <Button size="lg" className="w-full bg-white text-indigo-700 hover:bg-blue-50 border-none font-black rounded-2xl py-8 text-xl shadow-xl transition-all hover:-translate-y-1">
                    Become a Host
                  </Button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
