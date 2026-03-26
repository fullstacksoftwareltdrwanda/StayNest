import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ShieldX, Home, ArrowLeft } from 'lucide-react'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gray-50/30 pt-24 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center animate-fade-in">
        <div className="w-20 h-20 bg-red-50 text-red-400 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-red-100">
          <ShieldX className="w-9 h-9" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-3">Access Denied</h1>
        <p className="text-gray-500 leading-relaxed mb-8 max-w-sm mx-auto">
          You don't have permission to view this page. Please check you're signed in with the correct account.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/">
            <Button className="rounded-2xl gap-2">
              <Home className="w-4 h-4" />
              Go to Homepage
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" className="rounded-2xl gap-2">
              <ArrowLeft className="w-4 h-4" />
              Sign In
            </Button>
          </Link>
        </div>

        <p className="text-xs text-gray-400 mt-8">
          If you believe this is an error, contact{' '}
          <span className="text-blue-500 font-medium">support@urugostay.com</span>
        </p>
      </div>
    </div>
  )
}
