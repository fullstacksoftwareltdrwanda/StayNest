'use client'

import { useEffect } from 'react'
import { Button } from '@/components/shared/Button'
import { AlertTriangle } from 'lucide-react'

export default function GuestError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center px-4">
      <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
        <AlertTriangle className="w-7 h-7 text-red-500" />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-black text-gray-900 tracking-tight">Something went wrong</h2>
        <p className="text-sm text-gray-500 font-medium max-w-sm">
          We hit an unexpected error. Your bookings are not affected.
        </p>
      </div>
      <div className="flex gap-3">
        <Button onClick={reset} size="md">Try again</Button>
        <Button variant="outline" size="md" onClick={() => window.location.href = '/dashboard'}>
          Go to dashboard
        </Button>
      </div>
    </div>
  )
}
