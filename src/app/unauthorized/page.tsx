import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Access Denied</h1>
      <p className="text-gray-600 max-w-md mb-8 leading-relaxed">
        Oops! You don't have the required role to access this page. This usually happens if you haven't switched to the **Host** role yet.
      </p>
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <form action="/api/auth/become-host" method="POST">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100">
            Become a Host Now
          </Button>
        </form>
        <Link href="/">
          <Button variant="outline" size="lg">Return to Homepage</Button>
        </Link>
      </div>
    </div>
  )
}
